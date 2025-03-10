import {
    createOutfit,
    deleteOutfit,
    getOutfitById,
    getAllOutfits,
    getOutfitsByUserId,
    updateOutfitInfo
} from "../database/queries.js";

export const fetchOutfits = async (req, res) => {
    try {
        const outfits = await getAllOutfits();
        res.status(200).json(outfits);
    } catch (error) {
        console.error('Error fetching outfits:', error);
        res.status(500).json({ error: 'Failed to fetch outfits' });
    }
};

export const fetchOutfitById = async (req, res) => {
    const { outfitID } = req.params;
    try {
        const outfit = await getOutfitById(outfitID);
        if (!outfit) {
            res.status(404).json({ error: 'Outfit not found' });
        } else {
            res.status(200).json(outfit);
        }
    } catch (error) {
        console.error(`Error fetching outfit by ID ${outfitID}:`, error);
        res.status(500).json({ error: 'Failed to fetch outfit' });
    }
};

export const createOutfitController = async (req, res) => {
    const { userID, name, occasion } = req.body;
    try {
        await createOutfit(userID, name, occasion);
        res.status(201).json({ message: 'Outfit created successfully' });
    } catch (error) {
        console.error('Error creating outfit:', error);
        res.status(500).json({ error: 'Failed to create outfit' });
    }
};

export const updateOutfitInfoController = async (req, res) => {
    const { outfitID } = req.params;
    const { userID, name, occasion } = req.body;

    // Filter out undefined fields from the request body
    const updates = Object.fromEntries(
        Object.entries({ userID, name, occasion }).filter(([_, value]) => value !== undefined)
    );

    // Return a 400 error if no fields are provided to update
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    try {
        await updateOutfitInfo(outfitID, updates);
        res.status(200).json({ message: 'Outfit updated successfully' });
    } catch (error) {
        console.error(`Error updating outfit by ID ${outfitID}:`, error);
        res.status(500).json({ error: 'Failed to update outfit' });
    }
};

export const updateUserOfOutfitController = async (req, res) => {
    const { outfitID, userID } = req.params;

    try {
        // Use the updateOutfit function to update only the userID
        await updateOutfitInfo(outfitID, { userID });
        res.status(200).json({ message: 'Outfit userID updated successfully' });
    } catch (error) {
        console.error(`Error updating userID for outfit ${outfitID}:`, error);
        res.status(500).json({ error: 'Failed to update outfit userID' });
    }
};

export const deleteOutfitController = async (req, res) => {
    const { outfitID } = req.params;
    try {
        await deleteOutfit(outfitID);
        res.status(200).json({ message: 'Outfit deleted successfully' });
    } catch (error) {
        console.error(`Error deleting outfit by ID ${outfitID}:`, error);
        res.status(500).json({ error: 'Failed to delete outfit' });
    }
};

export const getOutfitsByUserID = async (req, res) => {
    const userID = parseInt(req.params.userID, 10);
    if (isNaN(userID)) {
        return res.status(400).json({ error: 'Invalid userID' });
    }

    try {
        const outfits = await getOutfitsByUserId(userID);
        if (!outfits.length) {
            return res.status(404).json({ message: 'No outfits found for this user' });
        }
        res.status(200).json(outfits);
    } catch (error) {
        console.error(`Error fetching outfits for user ID ${userID}:`, error);
        res.status(500).json({ error: 'An error occurred while retrieving outfits' });
    }
};