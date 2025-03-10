import db from "../database/db-helper.js";

// Helper function for logging
function logError(operation, error) {
    console.error(`Error during ${operation}:`, error);
}

// User Queries
export function createUser(first_name, last_name, age, gender) {
    const createUserQuery = `INSERT INTO users (first_name, last_name, age, gender) VALUES (?, ?, ?, ?);`;
    try {
        const result = db.prepare(createUserQuery).run(first_name, last_name, age, gender);
        console.log('User created successfully:', result);
        return result;
    } catch (error) {
        logError('createUser', error);
        throw error;
    }
}

export function getUserById(userID) {
    const readUserQuery = `SELECT * FROM users WHERE userID = ?;`;
    try {
        const user = db.prepare(readUserQuery).get(userID);
        console.log('Fetched user by ID:', user);
        return user;
    } catch (error) {
        logError('getUserById', error);
        throw error;
    }
}

export function getOutfitsByUserId(userID) {
    const readOutfitsQuery = `SELECT * FROM outfits WHERE userID = ?;`;
    try {
        const outfits = db.prepare(readOutfitsQuery).all(userID);
        console.log('Fetched outfits by user ID:', outfits);
        return outfits;
    } catch (error) {
        logError('getOutfitsByUserId', error);
        throw error;
    }
}

export function getAllUsers() {
    const readAllUsersQuery = `SELECT * FROM users;`;
    try {
        const users = db.prepare(readAllUsersQuery).all();
        console.log('Fetched all users:', users);
        return users;
    } catch (error) {
        logError('getAllUsers', error);
        throw error;
    }
}

export function updateUser(userID, first_name, last_name, age, gender) {
    const updateUserQuery = `
        UPDATE users
        SET first_name = ?, last_name = ?, age = ?, gender = ?
        WHERE userID = ?;
    `;
    try {
        const result = db.prepare(updateUserQuery).run(first_name, last_name, age, gender, userID);
        console.log('User updated successfully:', result);
        return result;
    } catch (error) {
        logError('updateUser', error);
        throw error;
    }
}

export function updateUserInfo(userID, updates) {
    // Extract the keys and values from the updates object
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    // Dynamically construct the SQL query for updating only the provided fields
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const updateUserQuery = `
        UPDATE users
        SET ${setClause}
        WHERE userID = ?;
    `;

    try {
        // Add the userID to the values array for the WHERE clause
        const result = db.prepare(updateUserQuery).run(...values, userID);
        console.log('User updated successfully:', result);
        return result;
    } catch (error) {
        logError('updateUser', error);
        throw error;
    }
}

export function deleteUser(userID) {
    const deleteUserQuery = `DELETE FROM users WHERE userID = ?;`;
    try {
        const result = db.prepare(deleteUserQuery).run(userID);
        console.log('User deleted successfully:', result);
        return result;
    } catch (error) {
        logError('deleteUser', error);
        throw error;
    }
}

// Outfit Queries
export function createOutfit(userID, name, occasion) {
    const createOutfitQuery = `INSERT INTO outfits (userID, name, occasion) VALUES (?, ?, ?);`;
    try {
        const result = db.prepare(createOutfitQuery).run(userID, name, occasion);
        console.log('Outfit created successfully:', result);
        return result;
    } catch (error) {
        logError('createOutfit', error);
        throw error;
    }
}

export function getOutfitById(outfitID) {
    const readOutfitQuery = `SELECT * FROM outfits WHERE outfitID = ?;`;
    try {
        const outfit = db.prepare(readOutfitQuery).get(outfitID);
        console.log('Fetched outfit by ID:', outfit);
        return outfit;
    } catch (error) {
        logError('getOutfitById', error);
        throw error;
    }
}

export function getAllOutfits() {
    const readAllOutfitsQuery = `SELECT * FROM outfits;`;
    try {
        const outfits = db.prepare(readAllOutfitsQuery).all();
        console.log('Fetched all outfits:', outfits);
        return outfits;
    } catch (error) {
        logError('getAllOutfits', error);
        throw error;
    }
}

export function updateOutfitInfo(outfitID, updates) {
    // Extract the keys and values from the updates object
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    // Dynamically construct the SQL query to update only the provided fields
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const updateOutfitQuery = `
        UPDATE outfits
        SET ${setClause}
        WHERE outfitID = ?;
    `;

    try {
        // Add the outfitID to the values array for the WHERE clause
        const result = db.prepare(updateOutfitQuery).run(...values, outfitID);
        console.log('Outfit updated successfully:', result);
        return result;
    } catch (error) {
        logError('updateOutfit', error);
        throw error;
    }
}

export function deleteOutfit(outfitID) {
    const deleteOutfitQuery = `DELETE FROM outfits WHERE outfitID = ?;`;
    try {
        const result = db.prepare(deleteOutfitQuery).run(outfitID);
        console.log('Outfit deleted successfully:', result);
        return result;
    } catch (error) {
        logError('deleteOutfit', error);
        throw error;
    }
}

// Clothing Item Queries
export function createClothingItem(outfitID, type, color, brand, imageLink) {
    const createClothingItemQuery = `INSERT INTO clothingItems (outfitID, type, color, brand, imageLink) VALUES (?, ?, ?, ?, ?);`;
    try {
        const result = db.prepare(createClothingItemQuery).run(outfitID, type, color, brand, imageLink);
        console.log('Clothing item created successfully:', result);
        return result;
    } catch (error) {
        logError('createClothingItem', error);
        throw error;
    }
}

export function getClothingItemsByOutfitId(outfitID) {
    const readClothingItemsQuery = `SELECT * FROM clothingItems WHERE outfitID = ?;`;
    try {
        const items = db.prepare(readClothingItemsQuery).all(outfitID);
        console.log('Fetched clothing items by outfit ID:', items);
        return items;
    } catch (error) {
        logError('getClothingItemsByOutfitId', error);
        throw error;
    }
}

export function getClothingItemById(clothingItemID) {
    const readClothingItemQuery = `SELECT * FROM clothingItems WHERE clothingItemID = ?;`;
    try {
        const item = db.prepare(readClothingItemQuery).get(clothingItemID);
        console.log('Fetched clothing item by ID:', item);
        return item;
    } catch (error) {
        logError('getClothingItemById', error);
        throw error;
    }
}

export function getAllClothingItems() {
    const readAllClothingItemsQuery = `SELECT * FROM clothingItems;`;
    try {
        const clothingItems = db.prepare(readAllClothingItemsQuery).all();
        console.log('Fetched all clothing items:', clothingItems);
        return clothingItems;
    } catch (error) {
        logError('getAllClothingItems', error);
        throw error;
    }
}

export function updateClothingItemInfo(clothingItemID, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const updateClothingItemQuery = `
        UPDATE clothingItems
        SET ${setClause}
        WHERE clothingItemID = ?;
    `;

    try {
        const result = db.prepare(updateClothingItemQuery).run(...values, clothingItemID);
        console.log('Clothing item updated successfully:', result);
        return result;
    } catch (error) {
        logError('updateClothingItem', error);
        throw error;
    }
}

export function deleteClothingItem(clothingItemID) {
    const deleteClothingItemQuery = `DELETE FROM clothingItems WHERE clothingItemID = ?;`;
    try {
        const result = db.prepare(deleteClothingItemQuery).run(clothingItemID);
        console.log('Clothing item deleted successfully:', result);
        return result;
    } catch (error) {
        logError('deleteClothingItem', error);
        throw error;
    }
}