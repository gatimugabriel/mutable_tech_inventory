import { Router } from 'express';
const router = Router();
import { authMiddleware } from '../middleware/index.js';
import { productController } from '../controllers/index.js';

// -- public routes --//
router.get('/', productController.getAllProducts);
router.get('/:sku', productController.getProductBySku);

// -- protected routes --//
router.use(authMiddleware.verifyToken)

router.get('/purchase/:barcode', productController.purchaseProduct);
router.get('/level/lowstock', productController.getLowStockProducts);
router.get('/value/product/:sku', productController.getProductValue);
router.get('/value/all', productController.getAllProductsValue);
router.post('/re-order/:sku', productController.reOrderProduct);

// -- superuser routes --//
router.use(authMiddleware.requireSuperUser)

router.post('/add', productController.createProduct);
// update & delete product
router
    .route('/:sku')
    .put(productController.updateProduct)
    .delete(productController.deleteProduct);

export default router;
