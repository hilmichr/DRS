function toggleDropdown(event, dropdownId) {
    event.preventDefault();
    var dropdown = document.getElementById(dropdownId);
    var link = event.currentTarget;
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        link.classList.remove('open');
    } else {
        dropdown.style.display = "block";
        link.classList.add('open');
    }
}

function selectOption(event, optionText) {
    event.preventDefault();
    var resultField = document.getElementById('selected-component');
    resultField.textContent = "Ausgewählte Komponente: " + optionText;
}