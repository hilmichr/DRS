const imageList = ['Micro', 'Hatchback', 'SUV', 'MPV', 'Sedan', 'Reisemobile', 'Wagon', 'Cabrio', 'Electric'];

function showSuggestions() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    if (input.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    const filteredSuggestions = imageList.filter(item => item.toLowerCase().includes(input));

    if (filteredSuggestions.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    filteredSuggestions.forEach(item => {
        const suggestionItem = document.createElement('a');
        suggestionItem.href = '#';
        suggestionItem.textContent = item;
        suggestionItem.onclick = () => {
            document.getElementById('search-input').value = item;
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            showImage(item);
        };
        suggestionsBox.appendChild(suggestionItem);
    });

    suggestionsBox.style.display = 'block';
}

function showImage(name) {
    imageList.forEach(image => {
        const imageContainer = document.getElementById(image + '-container');
        if (imageContainer) {
            imageContainer.style.display = (image === name) ? 'flex' : 'none';
        }
    });
}

// Funktion, um das Popup-Fenster zu öffnen
function openPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Funktion, um das Popup-Fenster zu schließen
function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
