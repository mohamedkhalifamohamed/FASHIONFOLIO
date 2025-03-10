import {
    createClothingItem,
    deleteClothingItem,
    getClothingItemById,
    getAllClothingItems,
    getClothingItemsByOutfitId,
    updateClothingItemInfo,
} from "../database/queries.js";

export const fetchClothingItems = async (req, res) => {
    try {
        const clothingItems = await getAllClothingItems();
        res.status(200).json(clothingItems);
    } catch (error) {
        console.error('Failed to fetch clothing items:', error);
        res.status(500).json({ error: 'Failed to fetch clothing items' });
    }
};

export const fetchClothingItemById = async (req, res) => {
    const { clothingItemID } = req.params;
    try {
        const clothingItem = await getClothingItemById(clothingItemID);
        if (!clothingItem) {
            return res.status(404).json({ error: 'Clothing item not found' });
        }
        res.status(200).json(clothingItem);
    } catch (error) {
        console.error('Failed to fetch clothing item:', error);
        res.status(500).json({ error: 'Failed to fetch clothing item' });
    }
};

export const createClothingItemController = async (req, res) => {
    const { outfitID, type, color, brand, imageLink } = req.body;
    try {
        await createClothingItem(outfitID, type, color, brand, imageLink);
        res.status(201).json({ message: 'Clothing item created successfully' });
    } catch (error) {
        console.error('Failed to create clothing item:', error);
        res.status(500).json({ error: 'Failed to create clothing item' });
    }
};

export const updateClothingItemInfoController = async (req, res) => {
    const { clothingItemID } = req.params;
    const { outfitID, type, color, brand, imageLink } = req.body;

    // Filter out undefined fields from the request body
    const updates = Object.fromEntries(
        Object.entries({ outfitID, type, color, brand, imageLink }).filter(([_, value]) => value !== undefined)
    );

    // If no fields are provided, return a 400 Bad Request
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    try {
        await updateClothingItemInfo(clothingItemID, updates);
        res.status(200).json({ message: 'Clothing item updated successfully' });
    } catch (error) {
        console.error('Failed to update clothing item:', error);
        res.status(500).json({ error: 'Failed to update clothing item' });
    }
};

export const updateOutfitOfClothingItemController = async (req, res) => {
    const { clothingItemID, outfitID } = req.params;

    try {
        await updateClothingItemInfo(clothingItemID, { outfitID });
        res.status(200).json({ message: 'Clothing item outfitID updated successfully' });
    } catch (error) {
        console.error(`Failed to update outfitID for clothing item ${clothingItemID}:`, error);
        res.status(500).json({ error: 'Failed to update clothing item outfitID' });
    }
};

export const deleteClothingItemController = async (req, res) => {
    const { clothingItemID } = req.params;
    try {
        await deleteClothingItem(clothingItemID);
        res.status(200).json({ message: 'Clothing item deleted successfully' });
    } catch (error) {
        console.error('Failed to delete clothing item:', error);
        res.status(500).json({ error: 'Failed to delete clothing item' });
    }
};

export const getClothingItems = async (req, res) => {
    const outfitID = parseInt(req.params.outfitID, 10);
    if (isNaN(outfitID)) {
        return res.status(400).json({ error: 'Invalid outfitID' });
    }
    try {
        const clothingItems = await getClothingItemsByOutfitId(outfitID);
        if (clothingItems.length === 0) {
            return res.status(404).json({ message: 'No clothing items found for this outfit' });
        }
        res.status(200).json(clothingItems);
    } catch (error) {
        console.error('An error occurred while retrieving clothing items:', error);
        res.status(500).json({ error: 'An error occurred while retrieving clothing items' });
    }
};