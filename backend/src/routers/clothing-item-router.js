import express from 'express';
import {
    createClothingItemController,
    fetchClothingItemById,
    fetchClothingItems,
    deleteClothingItemController,
    getClothingItems,
    updateClothingItemInfoController,
    updateOutfitOfClothingItemController
} from "../controllers/clothing-item-controller.js";

const router = express.Router();

router.get('/', fetchClothingItems);
router.get('/:clothingItemID', fetchClothingItemById);
router.get('/:outfitID/clothingItems', getClothingItems);
router.post('/', createClothingItemController);
router.patch('/:clothingItemID', updateClothingItemInfoController);
router.patch('/:clothingItemID/outfits/:outfitID', updateOutfitOfClothingItemController);
router.delete('/:clothingItemID', deleteClothingItemController);

export default router;