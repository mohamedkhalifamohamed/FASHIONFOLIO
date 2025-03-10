import express from 'express';
import {
    createUserController,
    fetchUserById,
    fetchUsers,
    updateUserController,
    updateUserInfoController,
    deleteUserController
} from "../controllers/user-controller.js";

const router = express.Router();

router.get('/', fetchUsers);
router.get('/:userID', fetchUserById);
router.post('/', createUserController);
router.put('/:userID', updateUserController);
router.patch('/:userID', updateUserInfoController);
router.delete('/:userID', deleteUserController);

export default router;