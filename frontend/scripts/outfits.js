document.addEventListener('DOMContentLoaded', async () => {
    const outfitList = document.getElementById('app');
    const addOutfitForm = document.getElementById('addOutfit');
    const editModal = document.getElementById('editModal');
    const editOutfitForm = document.getElementById('editOutfit');
    let currentEditingOutfitID = null;
    let currentEditingUserID = null;

    const API_BASE_URL = 'http://localhost:3000/outfits';

    const createOutfitElement = (outfit) => {
        const outfitDiv = document.createElement('div');
        outfitDiv.className = 'outfit';
        outfitDiv.id = `outfit-${outfit.outfitID}`;
        outfitDiv.innerHTML = `
            <div class="outfit-header">
                <div class="outfit-basic-info">
                    <div class="outfit-name">${outfit.name}</div>
                    <div class="outfit-id">Outfit ID: ${outfit.outfitID}</div>
                    <div class="outfit-occasion">Occasion: ${outfit.occasion}</div>
                </div>
            </div>
            <div class="outfit-actions">
                <button class="outfit-remove" data-id="${outfit.outfitID}">Remove Outfit</button>
                <button class="outfit-edit" data-id="${outfit.outfitID}">Edit</button>
                <button class="outfit-view" data-id="${outfit.outfitID}">View</button>
            </div>
        `;

        const removeButton = outfitDiv.querySelector('.outfit-remove');
        removeButton.addEventListener('click', handleRemoveOutfit);

        const editButton = outfitDiv.querySelector('.outfit-edit');
        editButton.addEventListener('click', handleEditOutfit);

        const viewButton = outfitDiv.querySelector('.outfit-view');
        viewButton.addEventListener('click', handleViewOutfit);

        return outfitDiv;
    };

    const handleRemoveOutfit = async (e) => {
        const outfitID = parseInt(e.target.getAttribute('data-id'), 10);
        const outfitRef = document.getElementById(`outfit-${outfitID}`);

        if (outfitRef) {
            outfitRef.style.transition = 'opacity 0.5s, height 0.5s';
            outfitRef.style.opacity = '0';
            outfitRef.style.height = '0';

            try {
                await fetch(`${API_BASE_URL}/${outfitID}`, {
                    method: 'DELETE'
                });

                setTimeout(() => {
                    outfitList.removeChild(outfitRef);
                }, 500);
            } catch (error) {
                console.error('Error removing outfit:', error);
            }
        }
    };

    const handleAddOutfit = async (e) => {
        e.preventDefault();

        const formData = new FormData(addOutfitForm);
        const newOutfit = {
            name: formData.get('name'),
            occasion: formData.get('occasion')
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOutfit),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to add outfit: ${errorMessage}`);
            }

            const addedOutfit = await response.json();

            if (addedOutfit && addedOutfit.outfitID) {
                outfitList.appendChild(createOutfitElement(addedOutfit));
            }

            addOutfitForm.reset();
            alert('Outfit added successfully!');
        } catch (error) {
            console.error('Error adding outfit:', error.message);
            alert(error.message);
        }
    };

    const handleEditOutfit = async (e) => {
        currentEditingOutfitID = parseInt(e.target.getAttribute('data-id'), 10);
        const outfitRef = document.getElementById(`outfit-${currentEditingOutfitID}`);
        const name = outfitRef.querySelector('.outfit-name').textContent;
        const occasion = outfitRef.querySelector('.outfit-occasion').textContent.replace('Occasion: ', '');

        editOutfitForm.querySelector('input[name="name"]').value = name;
        editOutfitForm.querySelector('input[name="occasion"]').value = occasion;

        try {
            const response = await fetch(`${API_BASE_URL}/${currentEditingOutfitID}`);
            const outfit = await response.json();
            currentEditingUserID = outfit.userID; // Store the userID for later use
        } catch (error) {
            console.error('Error fetching outfit:', error);
        }

        editModal.style.display = 'block';
    };

    const handleViewOutfit = (e) => {
        const outfitID = e.target.getAttribute('data-id');
        window.location.href = `clothing-items-of-outfit.html?outfitID=${outfitID}`;
    };

    const handleEditOutfitSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(editOutfitForm);
        const updatedOutfit = {
            userID: currentEditingUserID, // Include userID in the update
            name: formData.get('name'),
            occasion: formData.get('occasion')
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${currentEditingOutfitID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedOutfit),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update outfit: ${errorMessage}`);
            }

            const updatedOutfitData = await response.json();
            const outfitRef = document.getElementById(`outfit-${currentEditingOutfitID}`);

            outfitRef.querySelector('.outfit-name').textContent = updatedOutfitData.name;
            outfitRef.querySelector('.outfit-occasion').textContent = `Occasion: ${updatedOutfitData.occasion}`;

            editModal.style.display = 'none';
            alert('Outfit updated successfully!');
            location.reload();
        } catch (error) {
            console.error('Error updating outfit:', error.message);
            alert(error.message);
        }
    };

    try {
        const response = await fetch(API_BASE_URL);
        const outfits = await response.json();

        outfits.forEach(outfit => {
            outfitList.appendChild(createOutfitElement(outfit));
        });
    } catch (error) {
        console.error('Error loading outfits:', error);
    }

    addOutfitForm.addEventListener('submit', handleAddOutfit);
    editOutfitForm.addEventListener('submit', handleEditOutfitSubmit);

    document.querySelector('.modal .close').addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});