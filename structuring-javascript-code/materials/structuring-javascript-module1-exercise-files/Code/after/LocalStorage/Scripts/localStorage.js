var foo = 2;

$(document).ready(function () {
    loadSettings();
    $('#SubmitButton').click(function () {
        if (hasLocalStorage) storeSettings();
        else alert('No local storage support');
    });
    $('#ClearButton').click(function () {
        localStorage.clear();
        loadSettings();
    });
});

function loadSettings() {
    var name = localStorage.getItem('name');
    var state = localStorage.getItem('state');
    $('#NameTextBox').val(name);
    $('#StatesSelect').val(state);
}

function storeSettings() {
    try {
        localStorage.setItem('name', $('#NameTextBox').val());
        localStorage.setItem('state', $('#StatesSelect').val());
        $('#OutputSpan').html('Settings Saved!');
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Storage quota exceeded');
        }
    }
}

function hasLocalStorage() {
    return ('localStorage' in window && window['localStorage'] != null);
}