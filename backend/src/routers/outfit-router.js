import express from 'express';
import {
    createOutfitController,
    fetchOutfitById,
    fetchOutfits,
    deleteOutfitController,
    getOutfitsByUserID,
    updateOutfitInfoController,
    updateUserOfOutfitController,
} from "../controllers/outfit-controller.js";

const router = express.Router();

router.get('/:userID/outfits', getOutfitsByUserID);
router.get('/', fetchOutfits);
router.get('/:outfitID', fetchOutfitById);
router.post('/', createOutfitController);
router.patch('/:outfitID', updateOutfitInfoController);
router.patch('/:outfitID/users/:userID', updateUserOfOutfitController);
router.delete('/:outfitID', deleteOutfitController);

export default router;