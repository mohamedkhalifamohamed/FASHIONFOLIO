import Database from "better-sqlite3";

// SQL statements to create the tables if they do not exist
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users
    (
        userID     INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name  TEXT NOT NULL,
        age        INTEGER,
        gender     TEXT NOT NULL
    );
`;

const createOutfitsTable = `
    CREATE TABLE IF NOT EXISTS outfits
    (
        outfitID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID   INTEGER,
        name     TEXT NOT NULL,
        occasion TEXT NOT NULL,
        FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE
    );
`;

const createClothingItemsTable = `
    CREATE TABLE IF NOT EXISTS clothingItems
    (
        clothingItemID INTEGER PRIMARY KEY AUTOINCREMENT,
        outfitID       INTEGER,
        type           TEXT NOT NULL,
        color          TEXT NOT NULL,
        brand          TEXT NOT NULL,
        imageLink      TEXT NOT NULL,
        FOREIGN KEY (outfitID) REFERENCES outfits (outfitID) ON DELETE CASCADE
    );
`;

// Dummy data for the tables
const users = [
    {
        first_name: 'John',
        last_name: 'Doe',
        age: 30,
        gender: 'Male'
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        age: 25,
        gender: 'Female'
    }
];

const outfits = [
    {
        userID: null, // Will be updated with real userID
        name: 'Casual',
        occasion: 'Weekend'
    },
    {
        userID: null, // Will be updated with real userID
        name: 'Formal',
        occasion: 'Wedding'
    }
];

const clothingItems = [
    {
        outfitID: null, // Will be updated with real outfitID
        type: 'T-Shirt',
        color: 'Blue',
        brand: 'BrandA',
        imageLink: 'http://example.com/tshirt.jpg'
    },
    {
        outfitID: null, // Will be updated with real outfitID
        type: 'Jeans',
        color: 'Black',
        brand: 'BrandB',
        imageLink: 'http://example.com/jeans.jpg'
    },
    {
        outfitID: null, // Will be updated with real outfitID
        type: 'Suit',
        color: 'Gray',
        brand: 'BrandC',
        imageLink: 'http://example.com/suit.jpg'
    },
    {
        outfitID: null, // Will be updated with real outfitID
        type: 'Tie',
        color: 'Red',
        brand: 'BrandD',
        imageLink: 'http://example.com/tie.jpg'
    }
];

let db;
try {
    db = new Database('db/data.sqlite');
    db.pragma('journal_mode = WAL');
    db.prepare(createUsersTable).run();
    db.prepare(createOutfitsTable).run();
    db.prepare(createClothingItemsTable).run();

    const insertIntoUsersQuery = `INSERT INTO users (first_name, last_name, age, gender)
                                  VALUES (?, ?, ?, ?);`;

    const insertIntoOutfitsQuery = `INSERT INTO outfits (userID, name, occasion)
                                    VALUES (?, ?, ?);`;

    const insertIntoClothingItemsQuery = `INSERT INTO clothingItems (outfitID, type, color, brand, imageLink)
                                          VALUES (?, ?, ?, ?, ?);`;

    const insertUser = db.prepare(insertIntoUsersQuery);
    const insertOutfit = db.prepare(insertIntoOutfitsQuery);
    const insertClothingItem = db.prepare(insertIntoClothingItemsQuery);

    // Insert users if not already existing
    const userIDs = [];
    db.transaction(() => {
        for (const user of users) {
            const existingUser = db.prepare(`SELECT userID FROM users WHERE first_name = ? AND last_name = ? AND age = ? AND gender = ?`)
                .get(user.first_name, user.last_name, user.age, user.gender);

            if (!existingUser) {
                const result = insertUser.run(user.first_name, user.last_name, user.age, user.gender);
                console.log(result);
                userIDs.push(result.lastInsertRowid);
            } else {
                userIDs.push(existingUser.userID);
            }
        }
    })();

    // Assign userIDs to outfits and insert them if not already existing
    const outfitIDs = [];
    db.transaction(() => {
        for (let i = 0; i < outfits.length; i++) {
            const outfit = outfits[i];
            outfit.userID = userIDs[i % userIDs.length]; // Use round-robin for assignment

            const existingOutfit = db.prepare(`SELECT outfitID FROM outfits WHERE userID = ? AND name = ? AND occasion = ?`)
                .get(outfit.userID, outfit.name, outfit.occasion);

            if (!existingOutfit) {
                const result = insertOutfit.run(outfit.userID, outfit.name, outfit.occasion);
                console.log(result);
                outfitIDs.push(result.lastInsertRowid);
            } else {
                outfitIDs.push(existingOutfit.outfitID);
            }
        }
    })();

// Assign outfitIDs to clothing items and insert them if not already existing
    db.transaction(() => {
        for (let i = 0; i < clothingItems.length; i++) {
            const clothingItem = clothingItems[i];
            clothingItem.outfitID = outfitIDs[i % outfitIDs.length]; // Use round-robin for assignment

            const existingClothingItem = db.prepare(`SELECT clothingItemID FROM clothingItems WHERE outfitID = ? AND type = ? AND color = ? AND brand = ? AND imageLink = ?`)
                .get(clothingItem.outfitID, clothingItem.type, clothingItem.color, clothingItem.brand, clothingItem.imageLink);

            if (!existingClothingItem) {
                const result = insertClothingItem.run(clothingItem.outfitID, clothingItem.type, clothingItem.color, clothingItem.brand, clothingItem.imageLink);
                console.log(result);
            }
        }
    })();

    console.log("Tables created and dummy data inserted successfully.");
} catch (e) {
    console.log(`Something went wrong while setting up the database! ${e}`);
    throw e;
}

export default db;