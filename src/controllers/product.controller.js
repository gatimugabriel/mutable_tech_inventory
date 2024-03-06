import expressAsyncHandler from 'express-async-handler';
import {Sequelize, Op} from 'sequelize';
import db from '../models/index.js';

const {Product} = db;

// @desc    Create a new product
// @route   POST /base_api/products
const createProduct = expressAsyncHandler(async (req, res) => {
    const {
        sku,
        barcode,
        productCode,
        productName,
        productDescription,
        productCategory,
        reOrderPoint,
        maximumStock,
        pricePerUnit
    } = req.body

    // check if product already exists
    const productExists = await Product.findOne({where: {sku}});
    if (productExists) {
        res.status(400);
        throw new Error('Product already exists in store');
    }

    // create product
    const product = await Product.create({
        sku,
        barcode,
        productCode,
        productName,
        productDescription,
        productCategory,
        reOrderPoint,
        maximumStock,
        pricePerUnit
    });

    if (!product) {
        res.status(400)
        throw new Error("Failed to add product")
    }

    res.status(201).json({
        message: "Successfully added product to store",
        productDetails: {
            id: product.id,
            sku: product.sku,
            barcode: product.barcode,
            productName: product.productName,
            productDescription: product.productDescription,
            productCategory: product.productCategory,
            reOrderPoint: product.reOrderPoint,
            maximumStock: product.maximumStock,
            pricePerUnit: product.pricePerUnit,
            inStock: product.inStock
        }
    });
});

// @desc    Get a product by ID
// @route   GET /base_api/products/:sku
const getProductBySku = expressAsyncHandler(async (req, res) => {
    const {sku} = req.params;

    const product = await Product.findOne({where: {sku}});
    if (!product) {
        res.status(404)
        res.send('Product not found');
    }

    res.status(200).json({
        product
    })
});

// @desc    Get all products
// @route   GET /base_api/products
const getAllProducts = expressAsyncHandler(async (req, res) => {
    const products = await Product.findAll();
    if (!products) {
        res.status(404)
        res.send('No products found');
    }

    res.status(200).send(products)
});

// @desc    Update a product
// @route   PUT /base_api/products/:sku
const updateProduct = expressAsyncHandler(async (req, res) => {
    const {sku} = req.params;
    const {
        newSku,
        barcode,
        productName,
        productDescription,
        productCategory,
        reOrderPoint,
        maximumStock,
        pricePerUnit
    } = req.body;

    const product = await Product.findOne({where: {sku}});
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.inStock > maximumStock) {
        res.status(400);
        throw new Error('Maximum stock cannot be less than current stock');
    }

    if (product.inStock < reOrderPoint) {
        res.status(400);
        throw new Error('Re-order point cannot be more than current stock');
    }

    if (newSku && product.sku !== newSku) {
        const skuExists = await Product.findOne({where: {sku: newSku}});
        if (skuExists) {
            res.status(400);
            throw new Error('Product with new SKU already exists');
        }
        product.sku = newSku;
    }

    if (barcode && product.barcode !== barcode) {
        const barcodeExists = await Product.findOne({where: {barcode}});
        if (barcodeExists) {
            res.status(400);
            throw new Error('Product with barcode already exists');
        }
        product.barcode = barcode;
    }

    product.productName = productName || product.productName;
    product.productDescription = productDescription || product.productDescription;
    product.productCategory = productCategory || product.productCategory;
    product.reOrderPoint = reOrderPoint || product.reOrderPoint;
    product.maximumStock = maximumStock || product.maximumStock;
    product.pricePerUnit = pricePerUnit || product.pricePerUnit;

    const updatedProduct = await product.save();
    if (!updatedProduct) {
        res.status(400);
        throw new Error('Failed to update product')
    }

    res.status(200).json({
        message: 'Product updated successfully',
        product: {
            id: updatedProduct.id,
            sku: updatedProduct.sku,
            barcode: updatedProduct.barcode,
            productName: updatedProduct.productName,
            productDescription: updatedProduct.productDescription,
            productCategory: updatedProduct.productCategory,
            reOrderPoint: updatedProduct.reOrderPoint,
            maximumStock: updatedProduct.maximumStock,
            pricePerUnit: updatedProduct.pricePerUnit,
            inStock: updatedProduct.inStock
        }
    });
});

// @desc    Delete a product
// @route   DELETE /base_api/products/:sku
const deleteProduct = expressAsyncHandler(async (req, res) => {
    const {sku} = req.params
    const product = await Product.findOne({where: {sku}})
    if (!product) {
        res.status(404)
        throw new Error('Product not found')
    }

    const deletedProduct = await product.destroy()
    if (!deletedProduct) {
        res.status(400)
        throw new Error('Failed to delete product')
    }
    res.status(200).json({
        message: 'Product deleted successfully'
    });
});

// @desc    Sell a product
// @route   GET /base_api/products/sell/:barcode
const sellProduct = expressAsyncHandler(async (req, res) => {
    const {barcode} = req.params;
    let {units} = req.query
    units = +units || 1;

    const product = await Product.findOne({where: {barcode}});
    if (!product) {
        res.status(404);
        throw new Error('Product barcode not found');
    }

    if (units > product.inStock) {
        return res.status(400).json({
            'Insufficient products in stock': 'Please reduce units to purchase',
            remainingProducts: product.inStock
        });
    }

    // update product stock after purchase
    product.inStock = product.inStock - units;
    const updatedProduct = await product.save();
    if (!updatedProduct) {
        res.status(400);
        throw new Error('Failed to complete purchase of the product');
    }

    res.status(200).json({
        message: 'Product purchased successfully',
        remainingUnits: updatedProduct.inStock
    });
});

// @desc Get all products with low stock
// @route GET /base_api/products/level/lowstock
const getLowStockProducts = expressAsyncHandler(async (req, res) => {
    const lowStockProducts = await Product.findAll({where: {inStock: {[Op.lt]: Sequelize.col('reOrderPoint')}}});
    if (!lowStockProducts) {
        res.status(404);
        throw new Error('No products with low stock');
    }

    res.status(200).send(lowStockProducts);
});

// @desc Get out of stock products
// @route GET /base_api/products/level/out-of-stock
const getOutOfStockProducts = expressAsyncHandler(async (req, res) => {
    const outOfStockProducts = await Product.findAll({where: {inStock: 0}});
    if (!outOfStockProducts) {
        res.status(404);
        throw new Error('No out of stock products');
    }

    res.status(200).send(outOfStockProducts);
});

// @desc Get a product's value
// @route GET /base_api/products/value/product/:sku
const getProductValue = expressAsyncHandler(async (req, res) => {
    const {sku} = req.params;
    const product = await Product.findOne({where: {sku}});
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const value = product.inStock * product.pricePerUnit;
    res.status(200).json({
        productName: product.productName,
        units: product.inStock,
        pricePerUnit: product.pricePerUnit,
        value
    });

});

// @desc get all products value
// @route GET /base_api/products/value
const getAllProductsValue = expressAsyncHandler(async (req, res) => {
    const products = await Product.findAll();
    if (!products) {
        res.status(404);
        throw new Error('No products found');
    }

    let totalValue = 0;
    products.forEach(product => {
        totalValue += product.inStock * product.pricePerUnit;
    });

    res.status(200).json({
        totalProductsInStock: products.length,
        totalValue
    })
});

// @desc Re-order product
// @route POST /base_api/products/reorder/:sku
const reOrderProduct = expressAsyncHandler(async (req, res) => {
    const {sku} = req.params;
    const product = await Product.findOne({where: {sku}});
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    product.inStock = product.maximumStock;
    const updatedProduct = await product.save();
    if (!updatedProduct) {
        res.status(400);
        throw new Error('Failed to re-order product');
    }

    res.status(200).json({
        message: 'Product re-ordered successfully',
        product: {
            sku: updatedProduct.sku,
            productName: updatedProduct.productName,
            inStock: updatedProduct.inStock,
            maximumStock: updatedProduct.maximumStock
        }
    });

});

export default {
    createProduct,
    getProductBySku,
    getAllProducts,
    updateProduct,
    deleteProduct,
    sellProduct,
    getLowStockProducts,
    getOutOfStockProducts,
    getProductValue,
    getAllProductsValue,
    reOrderProduct
};
