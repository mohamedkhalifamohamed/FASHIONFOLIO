document.addEventListener('DOMContentLoaded', async () => {
    const userName = document.getElementById('user-name');
    const outfitsContainer = document.getElementById('outfits-container');
    const addOutfitForm = document.getElementById('addOutfitForm');

    // Function to get a query parameter value by name
    const getQueryParam = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    };

    const userID = getQueryParam('userID');

    if (!userID) {
        alert('User ID is missing in the URL');
        return;
    }

    // Fetch user information and outfits
    try {
        const userResponse = await fetch(`http://localhost:3000/users/${userID}`);
        const user = await userResponse.json();
        console.log('Loaded user:', user);

        // Display user information
        userName.textContent = `${user.first_name} ${user.last_name}`;

        // Fetch and display user's outfits
        const outfitsResponse = await fetch(`http://localhost:3000/outfits/${userID}/outfits`);
        const outfits = await outfitsResponse.json();
        console.log('Loaded outfits:', outfits);

        const renderOutfit = (outfit) => {
            const outfitDiv = document.createElement('div');
            outfitDiv.className = 'outfit';
            outfitDiv.id = `outfit-${outfit.outfitID}`;
            outfitDiv.innerHTML = `
                <div class="outfit-basic-info">
                    <div class="outfit-name">Name: ${outfit.name}</div>
                    <div class="outfit-occasion">Occasion: ${outfit.occasion}</div>
                </div>
            `;

            // Add click event to navigate to the clothing items page
            outfitDiv.addEventListener('click', () => {
                window.location.href = `clothing-items-of-outfit.html?outfitID=${outfit.outfitID}`;
            });

            outfitsContainer.appendChild(outfitDiv);
        };

        outfits.forEach(renderOutfit);
    } catch (error) {
        console.error('Error loading user or outfits:', error);
    }

    // Handle add outfit form submission
    addOutfitForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addOutfitForm);
        const outfitID = formData.get('outfitID');

        try {
            // PATCH request to update the user of the outfit
            const response = await fetch(`http://localhost:3000/outfits/${outfitID}/users/${userID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update outfit user: ${errorMessage}`);
            }

            const updatedOutfit = await response.json();
            console.log('Updated outfit:', updatedOutfit);

            // Clear form fields after successful submission
            addOutfitForm.reset();

            // Show success message
            alert('Outfit added successfully!');

            // Reload the page to reflect the changes
            location.reload();
        } catch (error) {
            console.error('Error adding outfit:', error.message);
            alert(error.message);
        }
    });
});