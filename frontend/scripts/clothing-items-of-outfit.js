document.addEventListener('DOMContentLoaded', async () => {
    const outfitName = document.getElementById('outfit-name');
    const outfitOccasion = document.getElementById('outfit-occasion');
    const clothingItemsContainer = document.getElementById('clothing-items-container');
    const addClothingItemForm = document.getElementById('addClothingItemForm');

    // Function to get a query parameter value by name
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const outfitID = getQueryParam('outfitID');

    // Ensure the outfit ID exists in the URL
    if (!outfitID) {
        alert('Outfit ID is missing in the URL');
        return;
    }

    // Fetch the outfit details and its clothing items
    try {
        // Fetch outfit details
        const outfitResponse = await fetch(`http://localhost:3000/outfits/${outfitID}`);
        const outfit = await outfitResponse.json();
        outfitName.textContent = `${outfit.name}`;
        outfitOccasion.textContent = `OCCASION (${outfit.occasion})`;

        // Fetch clothing items associated with this outfit
        const clothingItemsResponse = await fetch(`http://localhost:3000/clothingItems/${outfitID}/clothingItems`);
        const clothingItems = await clothingItemsResponse.json();

        // Render clothing items
        const renderClothingItem = (item) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'clothing-item';
            itemDiv.id = `clothing-item-${item.itemID}`;
            itemDiv.innerHTML = `
                <div class="clothing-item-header">
                    <div class="clothing-item-image">
                        <img src="${item.imageLink}" alt="${item.type}">
                    </div>
                    <div class="clothing-item-info">
                        <div class="clothing-item-type">${item.type}</div>
                        <div class="clothing-item-color">Color: ${item.color}</div>
                        <div class="clothing-item-brand">Brand: ${item.brand}</div>
                    </div>
                </div>
            `;
            clothingItemsContainer.appendChild(itemDiv);
        };

        clothingItems.forEach(renderClothingItem);
    } catch (error) {
        console.error('Error loading outfit or clothing items:', error);
    }

    // Handle the "Add Clothing Item" form submission
    addClothingItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addClothingItemForm);
        const clothingItemID = formData.get('clothingItemID'); // Get the clothing item ID from the form

        try {
            // PATCH request to update the outfit of the clothing item
            const response = await fetch(`http://localhost:3000/clothingItems/${clothingItemID}/outfits/${outfitID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update clothing item's outfit: ${errorMessage}`);
            }

            const updatedClothingItem = await response.json();
            console.log('Updated clothing item:', updatedClothingItem);

            // Reset the form and show a success message
            addClothingItemForm.reset();
            alert('Clothing item added successfully to the outfit!');

            // Reload the page to reflect the changes
            location.reload();
        } catch (error) {
            console.error('Error adding clothing item:', error.message);
            alert(error.message);
        }
    });
});