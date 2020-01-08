//This is a VERY old script (initially created in the late 90's...that's old)
//that demonstrates function spaghetti code.

    var webServicePath = "formBuilderWebServices.asmx?WSDL"; //Path to asmx file
    var webServiceSendPath = "formBuilderWebServicesSendXml.asmx?WSDL"; //Path to asmx file
    var iCallID;    //Used to track Web Service callback
    var counter = 0;
    var controlCounterArray = new Array();
    var activeWindow = "splash";
    var pages = -1;
    var currentPage = 0;
    var editMode = false;		//Determines if we are adding a new control or editing an existing one
	var blnFormCreated = false; //Determines if a form already exists or not.  This prevents users from clicking form controls before selecting an existing or new form first
    var yPixels = 5;
	var xPixels = 5;
	var propertySheetNameArray = new Array("select","checkbox","textbox","radioGroup",
	                                       "label");
    var el;	
    
   
	// Prevent right mouse clicks to view source
    document.oncontextmenu = function(){showMenu(); return false} //function(){return false;}
    window.onerror =     
		function (e,f,l) {
			alert("Please report the following error to feedback@xmlforasp.net:\n\n" +
				"Message: " + e + "\n" +
				"Line: " + l + ":" + f);
				return true;
		};
    
    function onExit() {
		event.returnValue = "If you have not saved your form all changes will be lost.";
	}

    function showMenu() {
		var select = document.all.tags("select");
		selectCount = select.length;
		if (selectCount > 0) {
			for (i=0;i<selectCount;i++) {
				select.item(i).style.visibility = "hidden";
			}
		}
        //ContextElement=event.srcElement;
        var x = event.clientX;
        var y = event.clientY;
        //menu1.style.leftPos+=10;
        var width = menu1.currentStyle.width.substring(0,menu1.currentStyle.width.length-2);
        if (x >= document.body.clientWidth - width) {
            menu1.style.posLeft = x - width;
        } else {
            menu1.style.posLeft = x;
        }
        var height = menu1.currentStyle.height.substring(0,menu1.currentStyle.height.length-2);
        if (y >= document.body.clientHeight - height) {
            menu1.style.posTop = y - height;
        } else {
            menu1.style.posTop = y;
        }
        menu1.style.display="";
        menu1.setCapture();
    }
    function toggleMenu() {
        el=event.srcElement;
        if (el.className=="menuItem") {
            el.className="highlightItem";
        } else if (el.className=="highlightItem") {
            el.className="menuItem";
        }
        if (el.className=="menuImage") {
            el.className="menuImageHighlight";
            el.parentElement.className="highlightItem";
        } else if (el.className=="menuImageHighlight") {
            el.className="menuImage";
            el.parentElement.className="menuItem";
        }
    }
    function clickMenu() {
		var select = document.all.tags("select");
		selectCount = select.length;
		if (selectCount > 0) {
			for (i=0;i<selectCount;i++) {
				select.item(i).style.visibility = "visible";
			}
		}
        menu1.releaseCapture();
        menu1.style.display="none";
        el=event.srcElement;
        if (el.doFunction != null) {
            eval(el.doFunction);
        } else if (el.parentElement.doFunction != null) {
            eval(el.parentElement.doFunction);
        }
    }
    // ***** START SELECT
	function saveSelectProperties(frm) {
		var document = xmlData.XMLDocument;
	    var thisPageNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']");
		var type = "select";
		var selectNode = document.createNode(1,"ctl","");
		selectNode.setAttribute("type",type);
		var subNum;  //used to see how much to take off of val1, val2, etc. substring.  1 if length is 4
		             //2 if length is 5 (val10 for example)
		var optionNode,sText,currentOption;
		if (optionProperties.innerHTML == "") {
		    alert("Please select how many options you would like.");
		    return false;
		}
		for (var i=0;i<frm.elements.length;i++) {
			current = frm.elements(i);
			if (current.name.substring(0,1) != "_" && current.name.toUpperCase().indexOf("VAL") == -1 && current.name.toUpperCase().indexOf("TXT") == -1) {  				//Filter out buttons, etc.
				/*
				if (current.name.toUpperCase() != "CID" && current.value == "" ) {
				    alert("Please complete all fields before proceeding.");
				    return false;
				}
				*/
				//Validate name to prevent dups, etc.
				if (current.name == "name") {
				    var checkName = validateName(document,current.value,frm.cid.value);
				    if (!checkName) return false;		//Invalid name is return is not 0
				}
				selectNode.setAttribute(current.name,validateValue(current.value));
			} else if (current.name.indexOf("val") != -1) {
			   currentOptName = current.name;
			   subNum = (currentOptName.length == 4)?1:2;
			   iNum = currentOptName.substring(currentOptName.length-subNum,currentOptName.length);
			   sText = eval("frm.txt" + iNum + ".value");
			   
			   if (eval("frm._delete" + iNum)) {  //Make sure there is a delete checkbox first
			       if (eval("frm._delete" + iNum + ".checked == true")) continue;
			   }
			   
			   if (current.value == "" || sText == "") {
			       //alert("Please complete all option field values.");
			       //return false;
			       continue;
			   }
			   optionNode = document.createNode(1,"ctl","");
			   optionNode.setAttribute("type","listItem");
			   optionNode.setAttribute("val",validateValue(current.value));
			   optionNode.setAttribute("txt",validateValue(sText));
			   selectNode.appendChild(optionNode);
			}
		}
		if (selectNode.childNodes.length == 0) {
		    alert("At least one option must be left.  All options cannot be deleted");
		    return;
		}
	    if (!editMode) {  									//Add a new node if not editing
	        selectNode.setAttribute("cid",controlCounterArray[currentPage]);  // Set ID to counter which is an auto-incrementor
	    	selectNode = setXYCoordinates(selectNode,controlCounterArray[currentPage]);
	    	thisPageNode.appendChild(selectNode);
	    	updateCounter(1);  //Increment our counter to track how many unique control we have
	    } else {  		 									//Otherwise, replace the old node with the new one
	        var id = frm.cid.value;
	        selectNode.setAttribute("cid",id);  		// Set id to existing id value
	    	selectNode = setXYCoordinates(selectNode,id);
	        var oldNode = document.selectSingleNode("//view[@vid='" + currentPage + "']/ctl[@cid='" + id + "']");
			if (frm._ctlTypes.value != "") { //They want to change control types
	            changeControlType(selectNode,type,frm._ctlTypes.value);
	        }	        
	        thisPageNode.replaceChild(selectNode,oldNode)

	    }
	    clean(frm);
	    paint();
	    showHide('selectProperties','workArea');
	}

	function createOptions(num) {
		var oTB, inc,output;
		inc = 0;
		output = "";

		if (optionProperties.innerHTML != "") {
			var answer = confirm("Click \"OK\" to preserve the current options and add " + num + " additional options.  Click \"Cancel\" to add " + num + " new options and erase the current options.");
		    if (!answer) {
		        optionProperties.innerHTML = "";
		    } else {
		        //See how many option elements there currently are
		        var frm = document.forms("selectPropertiesForm").elements;
		        var numOptions = 0;
		        for (var i=0;i<frm.length;i++) {
		            if (frm.elements(i).name.indexOf("val") != -1) {
		        		numOptions++;
		        	}
		        }
		        inc = numOptions;
		    }
		}

		if (num == "" || num == "undefined") {
			alert("Please enter the number of options you would like.");
			return false;
		}
		output += "<table width='95%' cellpadding='3' cellspacing='0' border='0'>";
		if (!answer) {
			output += "<tr><td colspan='4'><font face='arial' size='2'><b>Instructions: </b>Enter the value and text for the options that will appear in the DropDown.  The text is the part that the user will actually see.  To delete an option, click the checkbox associated with it.</td></tr>";
		}
		for (var i=0;i<num;i++) {
			if (i % 2 != 0) {
			    output += "<tr bgcolor='efefef'>";
			} else {
			    output += "<tr>";
			}
			output += "<td class='propertyText'>";
			if (i == 0 && num > 1) output += "<b>Delete:</b>";
			output += "</td>";
			output += "<td width='7%'>&nbsp;</td>";
			output += "<td align='left' width='42%' class='propertyText'><b>Value:</b></td>";
			output += "<td align='left' width='42%' class='propertyText'><b>Text:</b></td>";
			output += "</tr>";
			if (i % 2 != 0) {
			    output += "<tr bgcolor='efefef'>";
			} else {
			    output += "<tr>";
			}
			output += "<td>";
			if (num>1) output += "<input type='checkbox' name='_delete" + inc + "'>";
			output += "</td>";
			output += "<td width='7%'>&nbsp;</td>";
			output += "<td width='42%'><input type='text' name='val" + inc + "' size='10'></td>";
			output += "<td width='42%'><input type='text' name='txt" + inc + "' size='15'></td></tr>";
			inc++;
		}
		output += "</table><div>";
		optionProperties.innerHTML += output;
	}
    // ***** END SELECT

    // ***** START RADIO BUTTON
 
	function saveRadioButtonProperties(frm) {
		var document = xmlData.XMLDocument;
	    var thisPageNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']");
		var groupNode = document.createElement("ctl");
		var type = "radioGroup";
		var subNum;
		var radioNode,sText;
		groupNode.setAttribute("type",type);

		if (radioGroupProperties2.innerHTML == "") {
		    alert("Please select how many radio buttons you would like.");
		    return false;
		}
		for (var i=0;i<frm.elements.length;i++) {
			current = frm.elements(i);
			if (current.name.substring(0,1) != "_" && current.name.toUpperCase().indexOf("VAL") == -1 && current.name.toUpperCase().indexOf("TXT") == -1) {  				//Filter out buttons, etc.
				/*
				if (current.name.toUpperCase() != "CID" && current.value == "") {
				    alert("Please complete all fields before proceeding.");
				    return false;
				}
				*/
				//Validate name to prevent dups, etc.
				if (current.name == "name") {
				    var checkName = validateName(document,current.value,frm.cid.value);
				    if (!checkName) return false;		//Invalid name is return is not 0
				}
				groupNode.setAttribute(current.name,validateValue(current.value));
			} else if (current.name.indexOf("val") != -1) {
			   currentOptName = current.name;
			   subNum = (currentOptName.length == 4)?1:2;
			   iNum = currentOptName.substring(currentOptName.length-subNum,currentOptName.length);
			   sText = eval("frm.txt" + iNum + ".value");
			   
			   if (eval("frm._delete" + iNum)) {  //Make sure there is a delete checkbox first
			       if (eval("frm._delete" + iNum + ".checked == true")) continue;
			   }
			   
			   if (current.value == "" || sText == "") {
			       //alert("Please complete all radio button field values.");
			       //return false;
			       continue;
			   }
			   radioNode = document.createElement("ctl");
			   radioNode.setAttribute("type","listItem");
			   radioNode.setAttribute("val",validateValue(current.value));
			   radioNode.setAttribute("txt",validateValue(sText));
			   groupNode.appendChild(radioNode);
			}
		}
		if (groupNode.childNodes.length < 2) {
		    alert("At least two radio buttons must be left.  To delete the radio button group, hit the \"Delete\" button below.");
		    return;
		}
	    if (!editMode) {  									//Add a new node if not editing
	        groupNode.setAttribute("cid",controlCounterArray[currentPage]);  // Set ID to counter which is an auto-incrementor
   	    	groupNode = setXYCoordinates(groupNode,controlCounterArray[currentPage]);
	    	thisPageNode.appendChild(groupNode);
		    if (!editMode) updateCounter(1);  //Increment our counter to track how many unique control we have
	    } else {  		 									//Otherwise, replace the old node with the new one
	        var id = frm.cid.value;
	        var oldNode = document.selectSingleNode("//view[@vid='" + currentPage + "']/ctl[@cid='" + id + "']");
	        groupNode.setAttribute("cid",id);  		// Set id to existing id value
   	    	groupNode = setXYCoordinates(groupNode,id);
	        if (frm._ctlTypes.value != "") { //They want to change control types
	            changeControlType(groupNode,type,frm._ctlTypes.value);
	        }	        
	        thisPageNode.replaceChild(groupNode,oldNode)

	    }
	    clean(frm);
	    paint();
	    showHide('radioGroupProperties','workArea');
	}


	function createRadios(num) {
		var oTB, inc,output;
		inc = 0;
		output = "";

		if (num == 1) {
		    alert("At a minimum, you need to select 2 radio buttons.");
		    return false;
		}

		if (radioGroupProperties2.innerHTML != "") {
			var answer = confirm("Click \"OK\" to preserve the current radio buttons and add " + num + " additional radio buttons.  Click \"Cancel\" to add " + num + " new radio buttons and erase the current ones.");
		    if (!answer) {
		        radioGroupProperties2.innerHTML = "";
		    } else {
		        //See how many radio elements there currently are
		        var frm = document.forms("radioGroupPropertiesForm").elements
		        var numOptions = 0;
		        for (var i=0;i<frm.length;i++) {
		            if (frm.elements(i).name.indexOf("val") != -1) {
		        		numOptions++;
		        	}
		        }
		        inc = numOptions;
		    }
		}

		if (num == "" || num == "undefined") {
			alert("Please enter the number of radio buttons you would like.");
			return false;
		}
		output += "<table width='95%' cellpadding='3' cellspacing='0' border='0'>";
		if (!answer) {
			output += "<tr><td colspan='4'><font face='arial' size='2'><b>Instructions: </b>Enter the value and text for the radio buttons that will appear in the form.  The text is the part that the user will actually see.</td></tr>";
		}
		for (var i=0;i<num;i++) {
			if (i % 2 != 0) {
			    output += "<tr bgcolor='efefef'>";
			} else {
			    output += "<tr>";
			}
			output += "<td class='propertyText'>";
			if (i == 0) output += "<b>Delete:</b>";
			output += "</td>";
			output += "<td width='7%'>&nbsp;</td>";
			output += "<td align='left' width='42%' class='propertyText'><b>Value:</b></td>";
			output += "<td align='left' width='42%' class='propertyText'><b>Text:</b></td>";
			output += "</tr>";
			if (i % 2 != 0) {
			    output += "<tr bgcolor='efefef'>";
			} else {
			    output += "<tr>";
			}
			output += "<td>";
			if (num>1) output += "<input type='checkbox' name='_delete" + inc + "'>";
			output += "</td>";
			output += "<td width='7%'>&nbsp;</td>";
			output += "<td width='42%'><input type='text' name='val" + inc + "' size='10'></td>";
			output += "<td width='42%'><input type='text' name='txt" + inc + "' size='15'></td></tr>";
			inc++;
		}
		output += "</table><div>";
		radioGroupProperties2.innerHTML += output;
	}
    // ***** END RADIO BUTTON


	function saveProperties(frm,type) {
		var namesArray = new Array();
		var valuesArray = new Array();
		var document = xmlData.XMLDocument;
	    var thisPageNode = document.selectSingleNode("//view[@vid='" + currentPage + "']");
		//var genericNode = document.createNode(1,"ctl","");
		//genericNode.setAttribute("type",type);

		for (var i=0;i<frm.elements.length;i++) {
			current = frm.elements(i);
			if (current.name == "name") {
			    var checkName = validateName(document,current.value,frm.cid.value);
			    if (!checkName) return false;		//Invalid name is return is not 0
			}
			if (current.name.substring(0,1) != "_") {  //Filter out buttons, etc.
				//genericNode.setAttribute(current.name,validateValue(current.value));
				namesArray[namesArray.length] = current.name;
				valuesArray[valuesArray.length] = validateValue(current.value);
			}
		}
        genericNode = createControlElement(type,namesArray,valuesArray);
	    if (!editMode) {  									//Add a new node if not editing
	        //genericNode.setAttribute("cid",controlCounterArray[currentPage]);  // Set ID to counter which is an auto-incrementor
	    	//genericNode = setXYCoordinates(genericNode,controlCounterArray[currentPage]);
	    	thisPageNode.appendChild(genericNode);
	    } else {  		 									//Otherwise, replace the old node with the new one
	        var id = frm.cid.value;
	        genericNode.setAttribute("cid",id);  		// Set id to existing id value
			//genericNode = setXYCoordinates(genericNode,id);
			var oldNode = document.selectSingleNode("//view[@vid='" + currentPage + "']/ctl[@cid='" + id + "']");
	        if (frm._ctlTypes.value != "") { //They want to change control types
	            changeControlType(genericNode,type,frm._ctlTypes.value);
	        } 	        
	        thisPageNode.replaceChild(genericNode,oldNode)

	    }
	    //if (!editMode) updateCounter(1);  //Increment our counter to track how many unique control we have
	    clean(frm);
	    paint();
	    showHide(type + "Properties","workArea");
	}
	
	function changeControlType(node,oldCtlType,ctlType) {
	    var oldNode;
	    var radioAndSelect = "select|radioGroup";
	    var radioAndSelectChange = false; //Track if user is changing from select to radio or vice versa.  We want to save listItem children in this case
	    var textboxAttsArray = new Array("required","def","size","max","regExp","errorMsg",
	                                "edit","textMode","dType");
	    var checkboxAttsArray = new Array("val","ste");
	    var radioGroupAttsArray = new Array("repeatDirection","required");        
	    var labelAttsArray = new Array("size");
	    var selectAttsArray = new Array();
	    
	    var change = confirm("Are you sure you would like to change this control type?  If so, click \"OK\".");
	    if (!change) return false;
	                       
		//Remove all children if not going from select to radioGroup or vice versa
		if (radioAndSelect.indexOf(oldCtlType) == -1 || radioAndSelect.indexOf(ctlType) == -1) {
			var oSelection = node.selectNodes("./*"); //select all children to remove
			oSelection.removeAll();
		} else {
			radioAndSelectChange = true;
		}

        //Change type attribute
        node.setAttribute("type",ctlType);
        node.setAttribute("sty",ctlType + "Class");
        
		//Remove the old control specific attributes
		for (var i=0;i<eval(oldCtlType + "AttsArray.length");i++) {
			node.removeAttribute(eval(oldCtlType + "AttsArray[i]"));
		}

        if (radioAndSelect.indexOf(ctlType) != -1 && radioAndSelectChange == false) {
        //Add default listItem child controls if appropriate
            var newNode;
            var doc = xmlData.XMLDocument;
            for (var i=0;i<2;i++) {
                newNode = doc.createNode(1,"ctl","");
                newNode.setAttribute("type","listItem");
                newNode.setAttribute("val",i);
                newNode.setAttribute("txt","Edit this value");
                node.appendChild(newNode);
            }
        }
	}
	
	function setXYCoordinates(node,id) {
		node.setAttribute("x",xPixels);
		node.setAttribute("y",id*yPixels);
		return node;
	}
	
	function isDbType() {
	    var root = xmlData.XMLDocument.documentElement;
	    if (parseInt(root.getAttribute("dbType")) < 2) {
	        return false;
	    } else {
	        return true;
	    }
	}

	function validateName(doc,val,cid,suppressAlerts) {  //Used to prevent duplicate names and use of reserved names
		var reservedNameList = "fid|uid|tid|iid|xid|as"; //reserved attribute names that user cannot use
		//alert(val.search(/^[a-zA-Z][a-zA-Z0-9\-]*(_chk$|$)/))
		if (val.search(/^[a-zA-Z][a-zA-Z0-9_]*$/) == -1) {
			if (!suppressAlerts) {
				alert("The name must start with an alphabetic character and can only have:\n\n- Alphabetic characters\n- Numbers\n- Underscore characters");
			}
			return false;
		}
		if (val == "") {
			if (!suppressAlerts) {
				alert("Please enter the name for this form control.");
			}
			return false;
		} 
		var nameNode = doc.selectSingleNode("//*[@name='" + val + "' and @cid != '" + cid + "']");
		if (nameNode != null) {
			if (!suppressAlerts) {
				alert("The name of this form control (" + val + ") has already been chosen.  Please select a different name.");
			}
			return false;
		}
		if (reservedNameList.toLowerCase().indexOf(val) != -1) {
		    if (!suppressAlerts) {
				alert("The name you selected for this form control is a reserved name.  Please choose another name.");
		    }
		    return false;
		}

		//No errors so return true
		return true;
	}
	
	function validateValue(s) {
		var re = /'/g;  //Replace the ' character with nothing;
		s = s.replace(re,"");
		re = /&/g;
		s = s.replace(re,"&amp;");
		re = /</g;
		s = s.replace(re,"&lt;");
		re = />/g;
		s = s.replace(re,"&gt;");
		re = /"/g;
		s = s.replace(re,"&quot;");
		return s;
	}

   
    function dbTypeOnChange(dd) {
        var selIndex = dd.selectedIndex;
        
        if (selIndex == 1) {  //Email option
            newFormPropertiesFormEmailType.style.display = "block";
            newFormPropertiesFormXMLType.style.display = "none";
            newFormPropertiesFormDbType.style.display = "none";
        } else if (selIndex == 2) { //XML option
            newFormPropertiesFormEmailType.style.display = "none";
            newFormPropertiesFormXMLType.style.display = "block";
            newFormPropertiesFormDbType.style.display = "none";      
        } else if (selIndex > 2) { //DB option
            if (selIndex == 5) { //Access
                document.all("lblDbServer").innerText = "Database Path:";
                document.all("lblDbName").style.display = "none";
                document.all("dbName").style.display = "none";
				newFormPropertiesCreateFormAction.style.display = "none";
            } else {
				if (selIndex == 3) { //show createFormAction dropdown
					newFormPropertiesCreateFormAction.style.display = "block";
				} else {
					newFormPropertiesCreateFormAction.style.display = "none";
				}
                document.all("lblDbServer").innerText = "Database Server:";
                document.all("lblDbName").style.display = "block";
                document.all("dbName").style.display = "block";
            }
            newFormPropertiesFormEmailType.style.display = "none";
            newFormPropertiesFormXMLType.style.display = "none";
            newFormPropertiesFormDbType.style.display = "block";
        } else {
            newFormPropertiesFormEmailType.style.display = "none";
            newFormPropertiesFormXMLType.style.display = "none";
            newFormPropertiesFormDbType.style.display = "none";
            newFormPropertiesCreateFormAction.style.display = "none";
        }    

    }
    
	function showHide(current,newOne, bypass) {
	    //If bypass is true then we can go from one property screen to another
	    if (bypass == null) bypass = false;
	    if (activeWindow == "splash" && blnFormCreated == false && !bypass) {
	        alertSelectForm();
			return false;
	    }
	    if (!bypass && activeWindow.indexOf("Properties") != -1 && newOne.indexOf("Properties") != -1) {
	    	alert("An active properties window is already open.  Please complete the current window and click the \"Save\" button.");
	    } else {
			document.all(current).style.display = "none";
			document.all(newOne).style.display = "block";
			activeWindow = newOne;
		}

	}

	function changeImage(id,newImg) {
	    var img = document.all(id);
	    img.style.cursor = "hand";
	    img.src="images/" + newImg;
	}

	function clean(frm) {
	     var noClean = new Array("STY","ALN");  //Hiddens that need to be left "uncleaned" since the values are fixed
		 for (var i=0;i<frm.elements.length;i++) {
		        current = frm.elements(i);
		        if (current.name.substring(0,1) != "_" && noClean.toString().indexOf(current.name.toUpperCase()) == -1) {  //Filter out buttons, etc.
		            if (current.type == "select-one") {
		            	current.selectedIndex = 0;
		            } else {
		    			current.value = "";
		    		}
		    	}
	    }
	    optionProperties.innerHTML = "";
	    radioGroupProperties2.innerHTML = "";
	    if (editMode) editMode = false;  //We are leaving the properties page so reset editMode
		
		for (var i=0;i<propertySheetNameArray.length;i++) {
			eval(propertySheetNameArray[i] + "PropertiesCtlTypes.style.display = 'none'");
		}
	}
	
	function openWindow(page,w,h) {
        window.open(page,"","status=no,width=" + w + ",height=" + h + ",scrollbars=yes");
    }
	
	/*function paintPreview() {
	    if (activeWindow.toUpperCase() == "SPLASH") {
	        alert("Please select a form before hitting the \"Preview Form\" button.");
	        return false;
	    }
	    showHide(activeWindow,'previewArea');
    	var pf = document.frames("previewPane").paint(0,previewMode);
	}*/

	function paint() {
	    if (splash.style.display == 'block') splash.style.display='none';
	    //Kludge to make fake parameters with the IE5 version of XSL
	    var transNode = xslData.XMLDocument.selectSingleNode("//xsl:template[@match='frm']/form/xsl:apply-templates");
	    transNode.setAttribute("select","./view[@vid='" + currentPage + "']");
		//End Kludge
		if (xmlData.documentElement.childNodes.length !=0) {
	      pagesCanvas.innerHTML = drawPages();
	      mainCanvas.innerHTML = xmlData.transformNode(xslData.XMLDocument);
	      return true;
	    } else {
		  alert("No controls have been added to the form.  Please add controls before continuing.");
		  return false;
	    }
	}
	
	function drawPages() {
        var tableOut = "<table border=\"0\" cellpadding=\"2\" cellspacing=\"1\"><tr>";
        var doc = xmlData.XMLDocument;
        var cap = "";
	    for (var i=0;i<pages+1;i++) {
	        if (i % 4 == 0) {  // Start a new row
	            tableOut += "</tr><tr>";
	        }
	        tableOut += "<td id=\"cell" + i + "\" align=\"center\" valign=\"middle\" ";	       
	        tableOut += "style=\"cursor:hand\" onClick=\"changePage('" + i + "')\" title=\"To edit a page name select it, right-click and select 'Edit Page Properties'.\" ";
	        if (i == currentPage) {
	            tableOut += "class=\"pageBorderOn\">";
	        } else {	
	            tableOut += "onMouseOver=\"this.style.backgroundColor='#cccccc'\" "
	            tableOut += "onMouseOut=\"this.style.backgroundColor='#efefef'\" ";
				tableOut += "class=\"pageBorderOff\">";
			}
			//Check what page name to write out
			var viewNode = doc.selectSingleNode("//view[@vid = '" + i + "']")
			if (viewNode != null) {
			    cap = viewNode.getAttribute("cap");
			    if (cap.length > 10) cap = cap.substring(cap,10) + "...";
			    tableOut += cap;		
			} else {
				tableOut += "Page " + (i+1) 
			}
			tableOut += "</td>";
	   }
	    tableOut += "</tr></table>";
	    return(tableOut);
	}

	function createPageInfo(frm) {   //Allows the user to give a page a name and adds to XML view element
		var pageNum = frm.pageNum.value
		//var displayCap = frm.displayCap.value;
		//var capAlignment = frm.capAlignment.options(frm.capAlignment.selectedIndex).value;
		var doc = xmlData.XMLDocument;
		var viewNode,current;
		if (pageNum == "") {  //Not editing
	        if (activeWindow.toUpperCase() != "WORKAREA" && activeWindow.toUpperCase() != "NEWPAGEPROPERTIES") {
	            alert("Please exit the current screen  before adding a new page.");
	            return;
	        }
	        //Create view node
	        viewNode = createPageElement();
	        doc.documentElement.appendChild(viewNode);	
		} else {			  //Editing page name so update attributes on view node and repaint
			viewNode = doc.selectSingleNode("//view[@vid = '" + pageNum + "']");
    	}
        if (frm.cap.value == "") frm.cap.value = "Page " + (pages+1);
		if (viewNode != null) {
			for (var i=0;i<frm.elements.length;i++) {
				current = frm.elements(i);
				if (current.name.substring(0,1) != "_" && current.name != "pageNum") {  //Filter out buttons, etc.
					viewNode.setAttribute(current.name,current.value);
				}
			}
		}	
		showHide(activeWindow,"workArea");  
		paint();
		//Clear these out so the values don't show when another page is added
        clean(frm);
        newPagePropertiesThemeDemo.innerHTML = "No Theme Selected";
	}
	
	function demoTheme(theme) {
		if (theme != "") {
			var transNode = xslThemeDemo.XMLDocument.selectSingleNode("//xsl:stylesheet/xsl:variable[@name='theme']");
			transNode.setAttribute("select","'" + theme + "'");
			//End Kludge
			newPagePropertiesThemeDemo.innerHTML = xmlThemeDemo.transformNode(xslThemeDemo.XMLDocument);
		} else {
			newPagePropertiesThemeDemo.innerHTML = "No Theme Selected";
		}
	}
	
	function changeControlStyle(ctl,over,cid) {
	    if (over) {
	        ctl.style.cursor = "hand";
	        ctl.className = "ctlOver";
	        //Show up and down arrows
	        document.all(cid).style.visibility = "visible";
	    } else {
	        ctl.style.cursor = "default";
	        ctl.className = "ctlTable";	  
	        //Hide up and down errors
	        document.all(cid).style.visibility = "hidden";  
	    }
	    window.event.cancelBubble = true;
	}
	
	function showNewPage() {
		//Carry over theme from any previous page so user doesn't have to 
		//select it each time a new page is created
		if (pages != -1) {
			var root = xmlData.XMLDocument.documentElement;
			var pageNode = root.selectSingleNode("//view[@vid='" + pages + "']");
			var theme = pageNode.getAttribute("theme");
			if (theme != "None") {
				document.forms("newPagePropertiesForm").theme.value = theme;
				demoTheme(theme);				
			}
		}
		showHide(activeWindow,'newPageProperties');
	}
	
	function editPageInfo(page) {
	    if (!blnFormCreated) {
	        alert("No page is available to edit.");
	        return false;
	    }
	    showHide(activeWindow,"newPageProperties");
	    var doc = xmlData.XMLDocument;
	    frm = document.forms("newPagePropertiesForm");
	    var viewNode = doc.selectSingleNode("//view[@vid = '" + page + "']");
	    var theme = viewNode.getAttribute("theme")
	    frm.cap.value = viewNode.getAttribute("cap");
	    frm.displayCap.value = viewNode.getAttribute("displayCap");
		frm.capAlignment.value = viewNode.getAttribute("capAlignment");
		frm.theme.value = theme;
		frm.pageNum.value = page;
		demoTheme(theme);
	}	
	
	function cancelFormProperties(frm) {
	    if (blnFormCreated && xmlData.XMLDocument.documentElement.getElementsByTagName("view").length > 0) {
	        showHide('newFormProperties','workArea');
	    } else {
			resetXML();
	        showHide('newFormProperties','splash');
	    }
	    clean(frm);
        newFormPropertiesFormEmailType.style.display = "none";
	    newFormPropertiesFormXMLType.style.display = "none";	
	    newFormPropertiesFormDbType.style.display = "none";	    
	}
	
	function editFormProperties() {
	    if (blnFormCreated) {
	        var root = xmlData.XMLDocument.documentElement;
	        frm = document.forms("newFormPropertiesForm");
	        frm.lang.value = root.getAttribute("lang");
	        frm.codeBehind.value = root.getAttribute("codeBehind");
	        frm.createFormAction.value = root.getAttribute("createFormAction");	 
	        
	        var dbType = parseInt(root.getAttribute("dbType"));
	        frm.dbType.value = dbType;
	        if (dbType == 1) {
	            frm.emailAddress.value = root.getAttribute("emailAddress");
	            frm.createFormAction.value = 0;
	            //newFormPropertiesFormEmailType.style.display = "block";
	        }
	        if (dbType == 2) {
	            frm.xmlFileName.value = root.getAttribute("xmlFileName");
	            frm.createFormAction.value = 0;
	            //newFormPropertiesFormXMLType.style.display = "block";
	        }
	        if (dbType > 2) { //They selected a database
	            frm.dbServer.value = root.getAttribute("dbServer");
	            frm.dbName.value = root.getAttribute("dbName");
	            frm.dbUID.value = root.getAttribute("dbUID");
	            frm.dbPWD.value = root.getAttribute("dbPWD");
	            if (dbType != 3) frm.createFormAction.value = 0; //Reset to "From Scratch" if not using SQL 7+
	            //newFormPropertiesFormDbType.style.display = "block";      
	        }
	        dbTypeOnChange(frm.dbType);  //Show and hide proper textboxes for selected storage mechanism
	        showHide(activeWindow,"newFormProperties",true);
	    } else {
	        alertSelectForm();
	    }
	}
	
	function alertSelectForm() {
	    alert("Before continuing, please either:\n\n1. Create a new form by clicking the \"New Form\" button\n\nOR\n\n2. Select an existing form from the dropdown box\n\n");
	}
	
	function changePage(newPageNum) {
	    currentPage = newPageNum;
	    paint();
	}
	
	function cancelPage() {
		var frm = document.forms("newPagePropertiesForm");
		if (pages != -1) {
		    showHide(activeWindow,"workArea");
		} else {
			var newForm = document.forms("newFormPropertiesForm");
		    blnFormCreated = false;
		    clean(newForm);
		    dbTypeOnChange(newForm.dbType);
		    showHide(activeWindow,"splash");
		}
		clean(frm);
		newPagePropertiesThemeDemo.innerHTML = "No Theme Selected";
	}
	
	function deletePage() {
	    if (activeWindow.toUpperCase() != "WORKAREA") {
	        alert("Please exit the current screen  before deleting a page.");
	        return;
	    }
	    /*
	    if (currentPage == 0) {
	        alert("Page 1 cannot be deleted.");
	        return false;
	    }
	    */
	    var choice = confirm("Are you sure you want to delete Page " + (parseInt(currentPage)+1) + " and all of its data?");
	    if (choice) {
	        var document = xmlData.XMLDocument;
			var pageNode = document.selectSingleNode("//view[@vid='" + currentPage + "']");
			var childNodes = pageNode.childNodes.length;
		
			document.documentElement.removeChild(pageNode);
			
			//Reset vid attribute since we now have one less page
			var pageNodes = document.selectNodes("//view");
			for (var i=0;i<pageNodes.length;i++) {
				pageNodes(i).setAttribute("vid",i);
			}
			
			//Reset variables by subtracting off 1
			controlCounterArray[currentPage] = 0;
			pages -= 1;
			
			if (currentPage == 0) {
				editFormProperties();
			} else {
				currentPage -= 1;
				paint();	
			}
	    }
	}
	
	function moveDown(id) {
		//var pageNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']");
		var node = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']/*[@cid='" + id + "']");
		var pageNode = node.parentNode;
		var nextNode = node.nextSibling;
		if (nextNode != null) {
			pageNode.insertBefore(node,nextNode.nextSibling);
		} else {
			alert("This control is already at the bottom.  It cannot be moved any lower.");
		}
		resetControlIDs(pageNode);
		paint();
	}
	
	function moveUp(id) {
		//var pageNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']");
		var node = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']/*[@cid='" + id + "']");
		var pageNode = node.parentNode;
		var prevNode = node.previousSibling;
		if (prevNode != null) {
		    pageNode.insertBefore(node,prevNode);
		} else {
		    alert("This control is already at the top.  It cannot be moved any higher.");
		}
		resetControlIDs(pageNode);
		paint();
	}
	
	function resetControlIDs(pageNode) {
		var cNodeLength = pageNode.childNodes.length;
		controlCounterArray[currentPage] = cNodeLength;
		for (var i=0;i<cNodeLength;i++) {
		    pageNode.childNodes(i).setAttribute("cid",i);
		    setXYCoordinates(pageNode.childNodes(i),i);    //Recalculate y axis
		}
	}

	function deleteNode(id) {
	    if (id != "") {
			var choice = confirm("Are you sure you want to delete this form control?");
			if (choice) {
				var pageNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']");
				var node = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']/*[@cid='" + id + "']");
				pageNode.removeChild(node);				
				//Reset all cid values since we deleted a control
				resetControlIDs(pageNode);
			}
			paint();
		}
	}

	function fillForm(node,frmName,div) {
	        //These fields are not in any forms.  They are added automatically by the application
	        var skipAtts = "x|y|w|h|pid|type";
			var child;
			var attList = node.attributes;
			var frm = document.forms(frmName);
			for (var i=0;i<attList.length;i++) {
			    if (skipAtts.indexOf(attList(i).nodeName) == -1) {  // != "x" && attList(i).nodeName !="y" && attList(i).nodeName != "w" && attList(i).nodeName != "h" && attList(i).nodeName != "pid") {
					eval("frm." + attList(i).nodeName + ".value = '" + attList(i).value + "'");
				}
			}
			// If there are child nodes, loop through their attributes also
			for (var i=0;i<node.childNodes.length;i++) {
 				childAtts = node.childNodes(i).attributes;
				for (var j=0;j<childAtts.length;j++) {
					if (skipAtts.indexOf(childAtts(j).nodeName) == -1) 
					eval("frm." + childAtts(j).nodeName + i + ".value = '" + childAtts(j).value + "'");
				}
			}
			showHide('workArea',div);
	}

	function editControl(id) {
	   editMode = true;
	   var currNode = xmlData.XMLDocument.selectSingleNode("//view[@vid='" + currentPage + "']/*[@cid='" + id + "']");
	   var ctlType = currNode.getAttribute("type");
	   switch (ctlType.toUpperCase()) {
	       case "RADIOGROUP":
	            var count = currNode.childNodes.length;
	            createRadios(count)
				break;
	       case "SELECT":
	            var optCount = currNode.childNodes.length;
	            createOptions(optCount)
	            break;
	   }
	   document.all(ctlType + "PropertiesCtlTypes").style.display = "block";
	   eval(ctlType + "PropertiesForm._ctlTypes.selectedIndex = 0");
	   fillForm(currNode,ctlType + "PropertiesForm",ctlType + "Properties");
	}
	
	function updateCounter(val) {
	   controlCounterArray[currentPage] += val;
	}
	
	function displayDbProps() {
	    var allIds = document.all;
	    var dbTypeNode,optionNode,textNode;
		var dbType = xmlData.XMLDocument.documentElement.getAttribute("dbType");
        var display, psName;
        display = (dbType < 3)?"none":"block"; 
	    if (display == "block") {	    
	        //Get to dbProps select node
	        var dbPropsDoc = dbProps.XMLDocument;
	        var dbPropsSelect = dbPropsDoc.documentElement.lastChild.lastChild.firstChild;
    	    var dbPropsSelectLength = dbPropsSelect.childNodes.length;
    	    var dbPropsSelectChildren = dbPropsSelect.selectNodes("./*");
    	    
    	    //Remove any select child nodes
            dbPropsSelectChildren.removeAll();   
    	    
 	        //Get to proper db node and then loop through child nodes
	        var dbRoot = dbFieldTypes.XMLDocument.documentElement;
	        var db = dbRoot.selectSingleNode("db[@type='" + dbType + "']");
	        var dbLength = db.childNodes.length;
    	    
	        for (var j=0;j<dbLength;j++) {
	            dbTypeNode = db.childNodes[j];
	            optionNode = dbPropsDoc.createElement("option");
	            optionNode.setAttribute("value",dbTypeNode.getAttribute("value"));
	            textNode = dbPropsDoc.createTextNode(dbTypeNode.getAttribute("text"));
	            optionNode.appendChild(textNode);
                dbPropsSelect.appendChild(optionNode)
	        }
	        
	        for (var i=0;i<propertySheetNameArray.length;i++) {
	            psName = propertySheetNameArray[i];
	            if (document.all(psName + "PropertiesDbProps")) {
	                document.all(psName + "PropertiesDbProps").innerHTML = dbPropsDoc.xml;
	            }
	        }
	    }
	    for (var i=0;i<propertySheetNameArray.length;i++) {
	        psName = propertySheetNameArray[i];
	        if (document.all(psName + "PropertiesDbProps")) {
	            document.all(psName + "PropertiesDbProps").style.display = display;
	        }
	    }    	    
	}
	
	function resetXML() {
		var sFormXML = "<frm uid=\"\" ver=\"\" fid=\"\"></frm>";	
	    xmlData.XMLDocument.loadXML(sFormXML);	
	    blnFormCreated = false;
	}
	
	function createForm(frm) {
	    if (!blnFormCreated) {  //We can edit a form so only load the XML string the first time form is created
		    resetXML();
	    }
	    var root = xmlData.XMLDocument.documentElement;
	    //Make sure the uid is added to the attributes of the frm element
	    if (root.getAttribute("uid") == "") root.setAttribute("uid",document.forms("submitFormPropertiesForm")._uid.value);
	    //Clear out att values if they aren't selecting any way to store
	    var fixedAtts = "fid|ver|name|uid";
	    var name = "";
	    for (var i=0;i<root.attributes.length;i++) {
	        name = root.attributes.item(i).name;  
	        if (name != "xmlns") { //don't try to change namespace since it is a read-only node
				if (fixedAtts.indexOf(name) == -1) {
					root.setAttribute(name,"");
				} 
			}
	    }
	    
	    var dbType = frm.dbType.value;
	    //Remove dbAtts if they select to submit the form as XML, via email, or not at all
	    //if (dbType < 3) removeCtlDbAtts(dbType);
        for (i=0;i<frm.elements.length;i++) {
            
            if (frm.elements(i).name.substring(0,1) != "_") {
                //If they select a db type then ensure they complete all fields
                if (dbType == 1 && (frm.elements(i).name == "emailAddress" && frm.elements(i).value == "")) {
                    alert("Please complete the Email Address field.");
                    return false;
                }
                if (dbType == 2 && (frm.elements(i).name == "xmlFileName" && frm.elements(i).value == "")) {
                    alert("Please complete the XML File Name field.");
                    return false;
                }
                //Allow for a blank password but require all other fields
                if (dbType > 2 && dbType < 5 && (frm.elements(i).name != "dbUID" &&
                                   frm.elements(i).name != "dbPWD" && 
                                   frm.elements(i).name != "emailAddress" && 
                                   frm.elements(i).name != "xmlFileName" && 
                                   frm.elements(i).value == "")) {
                    alert("Please complete the Database Server and Database Name fields.");
                    return false;
                }
                //Allow for a blank password but require all other fields
                if (dbType == 5 && frm.elements(i).name == "dbServer" &&
                                   frm.elements(i).value == "") {
                    alert("Please complete the Database Path field.");
                    return false;
                }
                root.setAttribute(frm.elements(i).name,frm.elements(i).value);
            }
        }
        displayDbProps(); //Show db options for controls   
        clean(frm);
        if (blnFormCreated && pages >= 0) { //Editing form properties (and have 1 or more pages) so don't create a new page. Check pages in cases they deleted page 1 and came to this function.
            //allow them to retry getting db info when they are not creating form from 
            //scratch and initial db metedata info attempt failed
            if (root.getAttribute("createFormAction") == 1 && dbType == 3) {
				getRemoteDbInfo();
		    } else {
				showHide(activeWindow,"workArea");
			}
        } else {
            initializePages();
            blnFormCreated = true; //Set to true so that we know users can now add form controls
            if (root.getAttribute("createFormAction") == 1 && dbType == 3) { //Normal
				getRemoteDbInfo();
			} else { //Selected SQL 7+ and want to create form from db tables
				showHide(activeWindow,"newPageProperties",true);
			}
        }		
	}

	function removeCtlDbAtts(dbType) {
		var ctlList = xmlData.XMLDocument.documentElement.selectNodes("//ctl");
		var ctlListLength = ctlList.length;
		var ctlNode;
		for (var i=0;i<ctlListLength;i++) {
		    ctlNode = ctlList(i);
		    ctlNode.removeAttribute("dbTable");
		    ctlNode.removeAttribute("dbField");
		    ctlNode.removeAttribute("dbFieldType");
		}
	}
	
	function showSaveForm() {
	    if (activeWindow.toUpperCase() == "SPLASH") {
	        alert("Please select a form before hitting the \"Save Form\" button.");
	        return false;
	    }
		if (activeWindow.toUpperCase() != "WORKAREA") {
	        alert("Please exit the current screen  before saving the form.");
	        return;
	    }
	    var form_name = xmlData.XMLDocument.documentElement.getAttribute("name");
	    if (form_name == null) form_name = "";
	    document.forms("submitForm").form_name.value = form_name;
	    showHide(activeWindow,'submitFormProperties');
    }
	
	function updateForm(frm) {
	  var root = xmlData.XMLDocument.documentElement;
	  root.setAttribute("uid",frm._uid.value);
	  var fid = root.getAttribute("fid");
	  var form_name = frm.form_name.value;
	  var email_addrs = frm.email_addrs.value;
	  var generateCode = frm.generateCode.value;
	  if (fid == null || fid == "") root.setAttribute("fid","0");
	  if (form_name != "") {
		  frm._submitFormButton.disabled = true;
	      //Add name to form root element
	      root.setAttribute("name",form_name);
	      iCallID = webServiceSendXml.wsSend.callService(onWSUpdateForm,"UpdateForm",
	                                                     form_name,generateCode,email_addrs,
	                                                     xmlData);
	  } else {
	      alert("Please enter a name for this form.")
	  }
	}
	
    function onWSUpdateForm(result) {
        if (result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
			var frm = document.forms("submitFormPropertiesForm");
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var returnDataRoot = returnData.documentElement.firstChild;
		    if (returnDataRoot.selectSingleNode("status").text == 0) { //Assign form XML to xmlData Document
			    //alert("The form was successfully saved!");
			    if (document.forms("submitFormPropertiesForm").generateCode.value == "true") {
					var doc = xmlData.XMLDocument;
					var formName = returnDataRoot.selectSingleNode("formPath").text;
				    var formPath = "tempForms/" + formName + ".aspx";
				    //downloadCodePropertiesFormLink.innerHTML = "<a href=\"" + formPath + "\" target=\"_blank\">ASP.NET Form File</a>";
				    if (doc.documentElement.getAttribute("codeBehind") == "true") {
						var codeBehindPath = "tempForms/" + formName + ".aspx." + doc.documentElement.getAttribute("lang");
					//	downloadCodePropertiesCodeBehindLink.innerHTML = "<a href=\"" + codeBehindPath + "\" target=\"_blank\">Code-behind File</a>";				    
					}					
				    showHide(activeWindow,'downloadCodeProperties',true);
			    } else {
					alert("The form was successfully saved!");
					showHide(activeWindow,'splash');			    
			    }	
			    getUserForms();
			    clean(frm);                                            
				frm._submitFormButton.disabled = false;  				
			    resetXML();

			    /*
			    if (confirmTest) {
                    location.href="formBuilder.aspx";
                } else {
                    location.href="formBuilder_login.aspx?logout=true";
                }
                */
		    } else {
    		    alert("An error occured while saving the form: \n\n" + returnDataRoot.selectSingleNode("message").text);
		    	frm._submitFormButton.disabled = false;  
		    }  
        }
    }
    
	function getUserForms() {  //Calls web service to get forms for dropdown
		var uid = document.forms("submitFormPropertiesForm")._uid.value;
		if (uid == "") {
			alert("No user information available.  The forms could not be loaded.");
		} else {
			iCallID = webService.ws.callService(onWSGetUserForms, "GetUserForms", uid);
		}
	}
	
	function createRemoteDbControls(frm) {
		var ctlCount = frm._controlCount.value;
		var dbTable = frm.ddRemoteDBTables.options(frm.ddRemoteDBTables.selectedIndex).text;
		var name,dbFieldControlType,dbField,dbFieldType,dbMaxSize,dbFieldNullable;
		var namesArray,valuesArray,required,ctlNode;
		var doc = xmlData.XMLDocument;
	    var pageNode = doc.selectSingleNode("//view[@vid='" + currentPage + "']");
		if (pageNode == null) {
			pageNode = createPageElement();
		}
		for (var i=0;i<ctlCount;i++) {
			dbFieldControlType = eval("frm.dbFieldControlType" + i + ".value");
			if (dbFieldControlType != "") {
				dbField = eval("frm.dbField" + i + ".value");
				dbFieldType = eval("frm.dbFieldType" + i + ".value");
				dbMaxSize = eval("frm.dbMaxSize" + i + ".value");
				dbFieldNullable = eval("frm.dbFieldNullable" + i + ".value");

				if (dbFieldNullable == 0) {
					required = "true";
				} else {
					required = "false";
				}
				switch (dbFieldControlType.toLowerCase()) {
					case "select": 
						name = "dd" + dbField;
						name = stripSpace(name);
						if (!validateName(doc,name,-1,true)) {
							alert("This column name already exists in the form.  To prevent duplicates it will be skipped.");
							continue;
						}
						namesArray = new Array("name","cap",  "dbTable","dbField",                "dbFieldType","sty",        "aln");
						valuesArray = new Array(name,  dbField,dbTable,  fixDbFieldName(dbField),  dbFieldType, "selectClass","left");
						break;
					case "checkbox":
						name = "chk" + dbField;
						name = stripSpace(name);
						if (!validateName(doc,name,-1,true)) {
							alert("This column name already exists in the form.  To prevent duplicates it will be skipped.");
							continue;
						}
						namesArray = new Array("name","cap",   "ste", "dbTable","dbField",                "dbFieldType","sty",          "aln");
						valuesArray = new Array(name,  dbField,"false",dbTable,  fixDbFieldName(dbField),  dbFieldType, "checkboxClass","left");
						break;
					case "radiogroup":
						name = "rdo" + dbField;
						name = stripSpace(name);
						if (!validateName(doc,name,-1,true)) {
							alert("This column name already exists in the form.  To prevent duplicates it will be skipped.");
							continue;
						}
						namesArray = new Array("name","cap",  "required","repeatDirection","dbTable","dbField",               "dbFieldType","sty",            "aln");
						valuesArray = new Array(name, dbField,required, "0",               dbTable,  fixDbFieldName(dbField),  dbFieldType, "radioGroupClass","left");
						break;
					case "textbox":
						name = "txt" + dbField;
						name = stripSpace(name);
						if (!validateName(doc,name,-1,true)) {
							alert("The column name: " + dbField + " already exists in the form.  To prevent duplicates it will be skipped.");
							continue;
						}
						namesArray = new Array("name","cap",   "required","edit","dbTable","dbField",                "dbFieldType","sty",         "aln");
						valuesArray = new Array(name,  dbField, required, "true", dbTable,  fixDbFieldName(dbField),  dbFieldType, "textboxClass","left");
						
						//Check if we need to add max size for textbox //dType, textMode
						if (dbFieldType == "char" || dbFieldType == "nchar" ||
							dbFieldType == "nvarchar" || dbFieldType == "varchar" &&
							dbMaxSize > 0) {
							namesArray[namesArray.length] = "max";
							valuesArray[valuesArray.length] = dbMaxSize;  
							namesArray[namesArray.length] = "dType";
							valuesArray[valuesArray.length] = "0"; 
							namesArray[namesArray.length] = "textMode";
							valuesArray[valuesArray.length] = "0"; 
						} else if (dbFieldType == "ntext" || dbFieldType == "text") {
							namesArray[namesArray.length] = "dType";
							valuesArray[valuesArray.length] = "0"; 
							namesArray[namesArray.length] = "textMode";
							valuesArray[valuesArray.length] = "1"; 	
						} else if (dbFieldType == "int") {
							namesArray[namesArray.length] = "dType";
							valuesArray[valuesArray.length] = "2"; 
							namesArray[namesArray.length] = "textMode";
							valuesArray[valuesArray.length] = "0"; 							
						} else {
							namesArray[namesArray.length] = "dType";
							valuesArray[valuesArray.length] = "0"; 
							namesArray[namesArray.length] = "textMode";
							valuesArray[valuesArray.length] = "0"; 
						}
						break;
					} //end switch
				ctlNode = createControlElement(dbFieldControlType,namesArray,valuesArray);
				pageNode.appendChild(ctlNode);
			} //end if
		} //end for loop
		doc.documentElement.appendChild(pageNode);
		clean(frm);
		document.all._btnAddRemoteDbControls.style.display = "none";
		document.all._btnViewform.style.display = "block";
		RemoteDbPropertiesTableColumns.innerHTML = "<b>No Table Columns Selected</b>";
		alert("The database columns have been added to your form!\n\nTo add more columns select another table.  If you are done adding columns click the View Form button.");
	}
	
	function stripSpace(val) {
		var tempVal = val;
		var regex = / /g;
		tempVal = tempVal.replace(regex,"_");
		return tempVal;
	}
	
	function fixDbFieldName(name) {
		tempName = name;
		if (name.indexOf(" ") != -1) {
			tempName = "[" + tempName + "]";
		}
		return tempName;
	}
	
	function createControlElement(ctlType,namesArray,valuesArray) {
		var doc = xmlData.XMLDocument;
		var node = doc.createElement("ctl");	
		
	    //Add attributes		
	    node.setAttribute("type",ctlType);
		for (var i=0;i<namesArray.length;i++) {
			node.setAttribute(namesArray[i],valuesArray[i]);
		}		
		//See if we are editing a node or creating a brand new one from scratch
		if (editMode) {
			node = setXYCoordinates(node,node.getAttribute("cid"));	  
		} else {
			node.setAttribute("cid",controlCounterArray[currentPage]);  
			node = setXYCoordinates(node,controlCounterArray[currentPage]);	
			//Update array that tracks unique controls per page
			updateCounter(1);
		}
		return node;
	}
	
	function createPageElement() {
		var doc = xmlData.XMLDocument;
		pages += 1;     
	    currentPage = pages;	    
	    controlCounterArray[currentPage] = 0;  //initialize array to 0 since first item added will be cid = 0
	    
	    //Add new page node to XMLDocument
	    var pageNode = doc.createElement("view");
	    pageNode.setAttribute("cap","Page " + (pages+1));
	    pageNode.setAttribute("vid",currentPage);
	    pageNode.setAttribute("displayCap","true");
	    pageNode.setAttribute("capAlignment","left");
	    pageNode.setAttribute("theme","None");
		return pageNode;
	}
	
	function getRemoteDbInfo(tableName) {
		var root = xmlData.XMLDocument.documentElement;
		var dbServer = root.getAttribute("dbServer");
		var dbName = root.getAttribute("dbName");
		var dbUID = root.getAttribute("dbUID");
		var dbPWD = root.getAttribute("dbPWD");
		var tblName = tableName;
		document.body.style.cursor = "wait";
		if (tblName != null && tblName != "undefined" && tblName != "") { //Get table metadata
			iCallID = webService.ws.callService(onWSGetRemoteDbTableMetaData, "GetRemoteDbTableMetaData",dbServer,dbName,dbUID,dbPWD,tblName);
		} else { //Get tables in db
			iCallID = webService.ws.callService(onWSGetRemoteDbTables, "GetRemoteDbTables",dbServer,dbName,dbUID,dbPWD);
		}
	}
	
	function cancelRemoteDbProperties(frm) {
		editFormProperties();
		RemoteDbPropertiesTableColumns.style.display = "none";
	}
	
	
    function onWSGetRemoteDbTableMetaData(result) {
        if (result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
			RemoteDbPropertiesTableColumns.style.display = "block";
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var colNodes = returnData.documentElement.getElementsByTagName("TableMetaData");
		    if (colNodes.length != 0) {
				var returnDataXSLT = new ActiveXObject("MSXML2.DOMDocument");
				returnDataXSLT.async = false;
				returnDataXSLT.load("ResourceHandler.ashx?formBuilderRemoteDB.xslt");
				//Quick way to update variable
				RemoteDbPropertiesTableColumns.innerHTML = returnData.transformNode(returnDataXSLT);		
				document.all._btnAddRemoteDbControls.style.display = "block";
				document.all._btnViewform.style.display = "block";
		    } else {
				alert("No columns were found for the selected table.\n\nPlease check your database connection information (to do this click Cancel) and ensure that the database is not blocked by a firewall.");
	    		RemoteDbPropertiesTableColumns.innerHTML = "<b>No Table Columns Selected</b>";
		    }
        }
	    document.body.style.cursor = "default";
    }
	
    function onWSGetRemoteDbTables(result) {
        if (result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var tableNodes = returnData.documentElement.getElementsByTagName("Tables");
		    if (tableNodes.length != 0) {
				var tableNode;
				var ddRemoteDBTables = document.all.ddRemoteDBTables;
				ddRemoteDBTables.innerHTML = "";
				ddRemoteDBTables.options.add(createOption("0","Select a Table:"));	
				for (var i=0;i<tableNodes.length;i++) {
					tableNode = tableNodes(i);
					ddRemoteDBTables.options.add(createOption(tableNode.lastChild.text,tableNode.firstChild.text));	
				}
				ddRemoteDBTables.selectedIndex = 0;
				showHide(activeWindow,"RemoteDbProperties",true);
		    } else {
				alert("No tables were found.\n\nPlease check your database connection information and ensure that database access is not blocked by a firewall.");
				editFormProperties();
		    }		    
        }
	    document.body.style.cursor = "default";
    }
    
    function onWSGetUserForms(result) {
        if (result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var forms = returnData.documentElement.getElementsByTagName("Forms");
		    
		    //Remove ddForms options
		    var ddForms = document.all.ddForms;
		    ddForms.innerHTML = "";
		    var form,option;

		    if (forms.length > 0) {
				ddForms.options.add(createOption("0","Select a Form:"));	
				for (var i=0;i<forms.length;i++) {
					form = forms(i);
					ddForms.options.add(createOption(form.firstChild.text,form.lastChild.text));	
				}
				//ddForms.style.display = "block";
				//document.forms("formCollectionForm").ddForms.selectedIndex = 0;
		    } else {
				ddForms.options.add(createOption("0","No Saved Forms"));	
				//document.all.ddForms.style.display = "none";
		    }
        }
    }
    
    function createOption(value,text) {
		var option = document.createElement("OPTION");
		option.value = value;
		option.text = text;
		return option;
    }

    
	function getForm(fid) {
	    var template = false;
	    if (activeWindow.toUpperCase().indexOf("PROPERTIES")!=-1) {
	       alert("Please exit the current window before selecting a form.");
	       return false;
	    }
	    if (fid.toString().indexOf("template") != -1) { 
	        var formArray = fid.split("|");
	        fid = formArray[1];
	        template = true
	    }
	    if (fid > 0) { //Editing an existing form so go get the form and initialize view variables
	        if (blnFormCreated) {
				var newForm = confirm("Click \"OK\" if you like to load this form.  Any changes to your existing form will be lost.");
				if (!newForm) {
					document.all.ddForms.selectedIndex = 0;
					return false;
				}
	        }
	        document.body.style.cursor = "wait";
	        iCallID = webService.ws.callService(onWSGetForm, "GetForm", fid);
    	} else if (fid==0) {
    		document.all.ddForms.selectedIndex = 0;
    	    if (blnFormCreated) {
    	        var newForm = confirm("Click \"OK\" if you like to begin a new form.  Any changes to your existing form will be lost.");
    	        if (newForm) {
    	            resetXML();
			        blnFormCreated = false; //In case they are cancelling an existing form
		            
		            //Reset dbType dropdown in case they were previously working with a different form
		            var dbType = document.all.dbType;
		            dbType.selectedIndex = 0;
		            dbTypeOnChange(dbType);
		            showHide(activeWindow,"newFormProperties",true);
    	        }
    	    } else {
    	        showHide(activeWindow,"newFormProperties",true);
    	    } 
		}
	}
	
    function onWSGetForm(result) {
        if (result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var returnDataRoot = returnData.documentElement.firstChild;
		    if (returnDataRoot.selectSingleNode("status").text == 0) { //Assign form XML to xmlData Document
		        xmlData.XMLDocument.documentElement = returnDataRoot.selectSingleNode("frm");
                displayDbProps(); //Show db options for controls                
			    initializePages();			
			    blnFormCreated = true; //Set to true so that we know users can now add form controls
			    activeWindow = "workArea";
			    showHide(activeWindow,"workArea");
			    paint();
		    } else {
    		    alert("An error occured while retrieving the form: \n\n" + returnDataRoot.selectSingleNode("message").text);
		    }  
        }
	    document.body.style.cursor = "default";
    }
    
	function deleteForm() {
	    var fid = xmlData.XMLDocument.documentElement.getAttribute("fid"); //document.forms("submitForm").fid.value
	    if (fid != "" && fid != "0") { 
	    	var answer = confirm("To delete the current form click \"OK\".  This action cannot be undone.  \n\nOtherwise, click \"Cancel\"");
		    if (answer) {
		    	document.body.style.cursor = "wait";
	            iCallID = webService.ws.callService(onWSDeleteForm, "DeleteForm", fid);
	   		}
		} //else {
		    //alert("A previously saved form must be selected before a delete can occur.  Please select the form you would like to delete.");
		    resetXML();
			initializePages();
		    showHide(activeWindow,"splash");
		//}
	}
	
    function onWSDeleteForm(result) {
        if(result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var returnDataRoot = returnData.documentElement.firstChild;

		    if (returnDataRoot.selectSingleNode("status").text == 0) {
			    //location.href="formBuilder.aspx";
  			    getUserForms();
		    } else {
    		    alert("An error occured during the form deletion: /n/n" + returnDataRoot.selectSingleNode("message").text);
		    }
        }
		document.body.style.cursor = "default";
    }
	
	function previewForm() {
	    //alert(xmlData.XMLDocument.xml);
	    if (!blnFormCreated) {
	        alert("An existing form must be present in order to use the preview mode.");
	        return false;
	    } else {	   
	        //set cursor
	    	document.body.style.cursor = "wait"; 
            iCallID = webServiceSendXml.wsSend.callService(onWSPreviewForm, "PreviewForm", xmlData);
            return true;	    
	    }      

	}
    function onWSPreviewForm(result) {
        if(result.error) {
            // Pull the error information from the result.errorDetail properties
            var xfaultcode   = result.errorDetail.code;
            var xfaultstring = result.errorDetail.string;
            var xfaultsoap   = result.errorDetail.raw;
            alert("Error returned from Web Service: " + xfaultcode + " " + xfaultstring);
        } else if(!result.error) {  
	        var returnData	= new ActiveXObject("MSXML2.DOMDocument"); 
		    returnData.documentElement	= result.value;
		    var returnDataRoot = returnData.documentElement.firstChild;
		    if (returnDataRoot.selectSingleNode("status").text == 0) {
		        var formPath = "tempForms/" + returnDataRoot.selectSingleNode("formPath").text + ".aspx";
		        openWindow(formPath,690,500);
		    } else {
    		    alert("An Error Occurred: " + returnDataRoot.selectSingleNode("message").text);
		    }
        }
        document.body.style.cursor = "default";
    }

	function initializeWebService() {
	    webService.useService(webServicePath,"ws");
	    webServiceSendXml.useService(webServiceSendPath,"wsSend");
	}
	
	function loadControlTypes() { 
	    //Generates different options for changing control types
	    var ctlDoc = ctlTypes.XMLDocument
	    var root = ctlDoc.documentElement;
	    var childLength = root.childNodes.length
	    var ctlTypesHtml = "";
	    var ctlNode,propertySheetName,type;
	    for (var i=0;i<propertySheetNameArray.length;i++) {
	        psName = propertySheetNameArray[i];
	        ctlTypesHtml = "<select id=\"_ctlTypes\" name=\"_ctlTypes\">";
	        ctlTypesHtml += "<option>No Change</option>";
	        for (var j=0;j<childLength;j++) {
	            ctlNode = root.childNodes(j);
	            type = ctlNode.getAttribute("type");
	            if (type != psName) {
					ctlTypesHtml += "<option value=" + type + ">" +
								ctlNode.getAttribute("name") + "</option>";	  
				}                    
	        }
	        document.all(psName + "PropertiesCtlTypesSelect").innerHTML = ctlTypesHtml;
	    }
	}
	
	function pageLoad() {
	   //activeWindow = "splash";
		var userAgent = navigator.userAgent;
		var MSIEIndex = userAgent.indexOf("MSIE");
		if (userAgent.indexOf("MSIE") == -1 || userAgent.substring((MSIEIndex + 5),(MSIEIndex + 6)) < 6) {
	       alert("We're sorry, but the form builder requires Internet Explorer 6 " +
	             " or higher.  If you do not have this browser, please visit: " + 
	             "http://www.microsoft.com/ie to download a copy.  You will now be taken " +
	             "back to the login page.");
	       window.location.href="../../content.asp?content=formbuilder.net";
	   }
	   //Try to avoid people that want to hack into code by going to page and viewing source
	   //Won't stop everyone but it will stop most
	   /*var w = document.body.clientWidth;
	   var h = document.body.clientHeight;
	   if (w > 810 || h > 610) {
	   		alert("An attempt is being made to view this page outside of its intended environment.  You will now be redirected.");
			location.href="../../content.asp?content=formbuilder.net";
	   }*/
	   initializeWebService();
	   //Added the following to ensure that all XML/XSLT docs get loaded properly
	   loadXMLDocs();
	   loadXSLTDocs();
	   initializePages();
       preloadImages();
       loadControlTypes();
       formBuilderInterfaceLoading.style.display = "none";
       formBuilderInterface.style.display = "block";
	}
	function loadXMLDocs() {
		var alertMsg = "There was an error retrieving a required document.  Please close this window and try reloading it: ";
		xmlThemeDemo.XMLDocument.async = false;
		xmlThemeDemo.XMLDocument.load("ResourceHandler.ashx?themeDemo.xml");
		if (xmlThemeDemo.XMLDocument.parseError > 0) {
			alert(alertMsg + "themeDemo");
		}
		dbFieldTypes.XMLDocument.async = false;
		dbFieldTypes.XMLDocument.load("ResourceHandler.ashx?dbTypes.xml");
		if (dbFieldTypes.XMLDocument.parseError > 0) {
			alert(alertMsg + "dbTypes");
		}	
		dbProps.XMLDocument.async = false;
		dbProps.XMLDocument.load("ResourceHandler.ashx?dbProps.xml");
		if (dbProps.XMLDocument.parseError > 0) {
			alert(alertMsg + "dbProps");
		}	
		ctlTypes.XMLDocument.async = false;
		ctlTypes.XMLDocument.load("ResourceHandler.ashx?ctlTypes.xml");
		if (ctlTypes.XMLDocument.parseError > 0) {
			alert(alertMsg + "ctlTypes");
		}	
	}
	function loadXSLTDocs() {
		var alertMsg = "There was an error retrieving a required document.  Please close this window and try reloading it: ";
		xslData.XMLDocument.async = false;
		xslData.XMLDocument.load("ResourceHandler.ashx?formBuilderClientSide.xslt");
		if (xslData.XMLDocument.parseError > 0) {
			alert(alertMsg + "formBuilderClientSide");
		}
		xslThemeDemo.XMLDocument.async = false;
		xslThemeDemo.XMLDocument.load("ResourceHandler.ashx?formBuilderThemeDemo.xslt");
		if (xslThemeDemo.XMLDocument.parseError > 0) {
			alert(alertMsg + "formBuilderThemeDemo");
		}	
	}
	
	function initializePages() {
	    // Reset global variables
	    var pageNodes = xmlData.XMLDocument.selectNodes("//view");
	    if (pageNodes.length == 0) {
			pages = -1;
	    } else {
			pages = parseInt(pageNodes.length)-1;	    
	    }
	    
	    for (i=0;i<pages+1;i++) {
			controlCounterArray[i] = pageNodes(i).childNodes.length;
	    }  
        counter = 0;
		currentPage = 0;
		editMode = false;		
		blnFormCreated = false;
		var newForm = document.forms("newFormPropertiesForm");
		newForm.lang.selectedIndex = 0;
		newForm.codeBehind.selectedIndex = 0;
	}
	
	function preloadImages() {
		if (document.images) {
			var checkbox_over = newImage("images/checkbox_over.gif");
			var label_over = newImage("images/label_over.gif");
			var dropdown_over = newImage("images/dropdown_over.gif");
			var radio_over = newImage("images/radio_over.gif");
			var textbox_over = newImage("images/textbox_over.gif");
		}
	}
	function newImage(arg) {
			rslt = new Image();
			rslt.src = arg;
			return rslt;
	}
			