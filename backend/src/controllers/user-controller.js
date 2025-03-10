import {
    createUser,
    deleteUser,
    getUserById,
    getAllUsers,
    updateUserInfo,
    updateUser
} from "../database/queries.js";

export const fetchUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const fetchUserById = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await getUserById(userID);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const createUserController = async (req, res) => {
    const { first_name, last_name, age, gender } = req.body;
    try {
        await createUser(first_name, last_name, age, gender);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const updateUserController = async (req, res) => {
    const { userID } = req.params;
    const { first_name, last_name, age, gender } = req.body;
    try {
        await updateUser(userID, first_name, last_name, age, gender);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const updateUserInfoController = async (req, res) => {
    const { userID } = req.params;
    const { first_name, last_name, age, gender } = req.body;

    // Filter out undefined fields from the request body
    const updates = Object.fromEntries(
        Object.entries({ first_name, last_name, age, gender }).filter(([_, value]) => value !== undefined)
    );

    // If no fields are provided, return a 400 Bad Request
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    try {
        await updateUserInfo(userID, updates);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUserController = async (req, res) => {
    const { userID } = req.params;
    try {
        await deleteUser(userID);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};