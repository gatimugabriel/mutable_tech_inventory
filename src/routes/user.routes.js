import { Router } from 'express';
const router = Router();
import { authMiddleware } from '../middleware/index.js';
import { userController } from '../controllers/index.js';

// all routes here require authentication
router.use(authMiddleware.verifyToken)

router
    .route("/profile")
    .get(userController.getUserProfile)
    .put(userController.updateUserProfile)
    .delete(userController.deleteUserProfile);

router.get('/profile/all', authMiddleware.requireSuperUser, userController.getAllProfiles)

export default router;