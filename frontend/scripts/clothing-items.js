document.addEventListener('DOMContentLoaded', async () => {
    const clothingItemList = document.getElementById('app');
    const addClothingItemForm = document.getElementById('addClothingItem');
    const editModal = document.getElementById('editModal');
    const editClothingItemForm = document.getElementById('editClothingItem');
    let currentEditingClothingItemID = null;

    const API_BASE_URL = 'http://localhost:3000/clothingItems';

    const createClothingItemElement = (clothingItem) => {
        const clothingItemDiv = document.createElement('div');
        clothingItemDiv.className = 'clothing-item';
        clothingItemDiv.id = `clothing-item-${clothingItem.clothingItemID}`;
        clothingItemDiv.innerHTML = `
            <div class="clothing-item-header">
                <div class="clothing-item-image">
                    <img src="${clothingItem.imageLink}" alt="${clothingItem.type}">
                </div>
                <div class="clothing-item-basic-info">
                    <div class="clothing-item-type">${clothingItem.type}</div>
                    <div class="clothing-item-id">ID: ${clothingItem.clothingItemID}</div>
                    <div class="clothing-item-color">Color: ${clothingItem.color}</div>
                    <div class="clothing-item-brand">Brand: ${clothingItem.brand}</div>
                </div>
            </div>
            <div class="clothing-item-actions">
                <button class="clothing-item-edit" data-id="${clothingItem.clothingItemID}">Edit</button>
                <button class="clothing-item-remove" data-id="${clothingItem.clothingItemID}">Remove</button>
            </div>
        `;

        const editButton = clothingItemDiv.querySelector('.clothing-item-edit');
        const removeButton = clothingItemDiv.querySelector('.clothing-item-remove');

        editButton.addEventListener('click', handleEditClothingItem);
        removeButton.addEventListener('click', handleRemoveClothingItem);

        return clothingItemDiv;
    };

    const handleAddClothingItem = async (e) => {
        e.preventDefault();

        const formData = new FormData(addClothingItemForm);
        const newClothingItem = {
            type: formData.get('type'),
            color: formData.get('color'),
            brand: formData.get('brand'),
            imageLink: formData.get('imageLink'),
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClothingItem),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to add clothing item: ${errorMessage}`);
            }

            const addedClothingItem = await response.json();

            if (addedClothingItem && addedClothingItem.clothingItemID) {
                clothingItemList.appendChild(createClothingItemElement(addedClothingItem));
            }

            addClothingItemForm.reset();
            alert('Clothing item added successfully!');
        } catch (error) {
            console.error('Error adding clothing item:', error.message);
            alert(error.message);
        }
    };

    const handleEditClothingItem = async (e) => {
        currentEditingClothingItemID = parseInt(e.target.getAttribute('data-id'), 10);
        const clothingItemRef = document.getElementById(`clothing-item-${currentEditingClothingItemID}`);
        const type = clothingItemRef.querySelector('.clothing-item-type').textContent;
        const color = clothingItemRef.querySelector('.clothing-item-color').textContent.replace('Color: ', '');
        const brand = clothingItemRef.querySelector('.clothing-item-brand').textContent.replace('Brand: ', '');
        const imageLink = clothingItemRef.querySelector('.clothing-item-image img').src;

        editClothingItemForm.querySelector('input[name="type"]').value = type;
        editClothingItemForm.querySelector('input[name="color"]').value = color;
        editClothingItemForm.querySelector('input[name="brand"]').value = brand;
        editClothingItemForm.querySelector('input[name="imageLink"]').value = imageLink;

        editModal.style.display = 'block';
    };

    const handleEditClothingItemSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(editClothingItemForm);
        const updatedClothingItem = {
            type: formData.get('type'),
            color: formData.get('color'),
            brand: formData.get('brand'),
            imageLink: formData.get('imageLink'),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${currentEditingClothingItemID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClothingItem),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update clothing item: ${errorMessage}`);
            }

            const updatedClothingItemData = await response.json();
            const clothingItemRef = document.getElementById(`clothing-item-${currentEditingClothingItemID}`);

            clothingItemRef.querySelector('.clothing-item-type').textContent = updatedClothingItemData.type;
            clothingItemRef.querySelector('.clothing-item-color').textContent = `Color: ${updatedClothingItemData.color}`;
            clothingItemRef.querySelector('.clothing-item-brand').textContent = `Brand: ${updatedClothingItemData.brand}`;
            clothingItemRef.querySelector('.clothing-item-image img').src = updatedClothingItemData.imageLink;

            editModal.style.display = 'none';
            alert('Clothing item updated successfully!');
            location.reload();
        } catch (error) {
            console.error('Error updating clothing item:', error.message);
            alert(error.message);
        }
    };

    const handleRemoveClothingItem = async (e) => {
        const clothingItemID = parseInt(e.target.getAttribute('data-id'), 10);

        try {
            const response = await fetch(`${API_BASE_URL}/${clothingItemID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to remove clothing item: ${errorMessage}`);
            }

            const clothingItemRef = document.getElementById(`clothing-item-${clothingItemID}`);
            clothingItemList.removeChild(clothingItemRef);
            alert('Clothing item removed successfully!');
        } catch (error) {
            console.error('Error removing clothing item:', error.message);
            alert(error.message);
        }
    };

    try {
        const response = await fetch(API_BASE_URL);
        const clothingItems = await response.json();

        clothingItems.forEach((clothingItem) => {
            clothingItemList.appendChild(createClothingItemElement(clothingItem));
        });
    } catch (error) {
        console.error('Error loading clothing items:', error);
    }

    addClothingItemForm.addEventListener('submit', handleAddClothingItem);
    editClothingItemForm.addEventListener('submit', handleEditClothingItemSubmit);

    document.querySelector('.modal .close').addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});