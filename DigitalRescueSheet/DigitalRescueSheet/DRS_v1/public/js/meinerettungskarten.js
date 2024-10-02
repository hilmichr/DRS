const imageList = ['Mercedes', 'Hatchback', 'SUV', 'MPV', 'Sedan', 'Reisemobile', 'Wagon', 'Cabrio', 'Electric'];

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

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function deleteItem(itemName) {
    const items = document.querySelectorAll('.item__text__title');
    let itemToDelete = Array.from(items).find(item => item.textContent.trim() === itemName);

    if (itemToDelete) {
        itemToDelete.closest('.item').remove();
        alert(`Deleted ${itemName}`);
    } else {
        alert(`${itemName} not found`);
    }
}

function promptForNewName(itemName) {
    let newName = prompt(`Enter a new name for ${itemName}:`);
    if (newName) {
        renameItem(itemName, newName);
    }
}

function renameItem(oldName, newName) {
    const items = document.querySelectorAll('.item__text__title');
    let itemTitle = Array.from(items).find(item => item.textContent.trim() === oldName);

    if (itemTitle) {
        itemTitle.textContent = newName;
        let itemImage = itemTitle.closest('.item').querySelector('img');
        if (itemImage) {
            itemImage.alt = newName;
        }
        alert(`Renamed ${oldName} to ${newName}`);
    } else {
        alert(`${oldName} not found`);
    }
}
