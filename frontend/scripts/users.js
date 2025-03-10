document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('app');
    const addUserForm = document.getElementById('addUser');

    const createUserElement = (user) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.id = `user-${user.userID}`;
        userDiv.innerHTML = `
            <div class="user-header">
                <div class="user-avatar">
                    <img
                        src="https://randomuser.me/api/portraits/${user.gender === 'male' ? 'men' : 'women'}/${user.userID}.jpg"
                        alt="${user.first_name} ${user.last_name}"
                    />
                </div>
                <div class="user-basic-info">
                    <div class="user-fullname">${user.first_name} ${user.last_name}</div>
                    <div class="user-id">User ID: ${user.userID}</div>
                    <div class="user-age">Age: ${user.age}</div>
                    <div class="user-gender">Gender: ${user.gender}</div>
                </div>
            </div>
            <div class="user-actions">
                <button class="user-remove" data-id="${user.userID}">Remove User</button>
                <button class="user-view" data-id="${user.userID}">View User</button>
            </div>
        `;

        const removeButton = userDiv.querySelector('.user-remove');
        const viewButton = userDiv.querySelector('.user-view');

        removeButton.addEventListener('click', handleRemoveUser);
        viewButton.addEventListener('click', handleViewUser);

        return userDiv;
    };

    const handleRemoveUser = async (e) => {
        const userID = parseInt(e.target.getAttribute('data-id'), 10);
        const userRef = document.getElementById(`user-${userID}`);

        if (userRef) {
            userRef.style.transition = 'opacity 0.5s, height 0.5s';
            userRef.style.opacity = '0';
            userRef.style.height = '0';

            try {
                // Perform the delete action on the backend
                await fetch(`http://localhost:3000/users/${userID}`, {
                    method: 'DELETE'
                });

                // After backend deletion, remove the user from the DOM
                setTimeout(() => {
                    userList.removeChild(userRef);
                }, 500);
            } catch (error) {
                console.error('Error removing user:', error);
            }
        }
    };

    const handleViewUser = (e) => {
        const userID = e.target.getAttribute('data-id');
        window.location.href = `outfits-of-user.html?userID=${userID}`;
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        const formData = new FormData(addUserForm);
        const newUser = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            age: formData.get('age'),
            gender: formData.get('gender')
        };

        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to add user: ${errorMessage}`);
            }

            const addedUser = await response.json();
            console.log('Server response:', addedUser);

            // Ensure the added user has the userID from the response
            if (addedUser && addedUser.userID) {
                userList.appendChild(createUserElement(addedUser));
            } else {
                console.error('Invalid user data from server:', addedUser);
            }

            // Clear form fields after successful submission
            addUserForm.reset();

            // Show success message (you can customize this)
            alert('User added successfully!');

            // Reload the page to reflect the new user
            location.reload();
        } catch (error) {
            console.error('Error adding user:', error.message);
            alert(error.message);
        }
    };

    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        console.log('Loaded users:', users);

        users.forEach(user => {
            userList.appendChild(createUserElement(user));
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }

    addUserForm.addEventListener('submit', handleAddUser);
});