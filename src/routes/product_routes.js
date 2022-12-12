'use strict';

import { Router } from 'express';
import ProductController from "../controllers/product_controller";
import TokenVerification from "../utils/token_verification";
import {productImageUpload} from "../utils/image_upload";

//  Set up Express Router.
const productRouter = Router();

//  Create a Product.
productRouter.post(
    "/create_product",
    TokenVerification.userTokenValidation,
    ProductController.createProduct
);

//  Get All Products
productRouter.get(
    "/all_products",
    TokenVerification.userTokenValidation,
    ProductController.getAllProducts
);

//  Get Single Product
productRouter.get(
    "/single_product/:id",
    TokenVerification.userTokenValidation,
    ProductController.getSingleProduct
);

//  Update Single Product
productRouter.put(
    "/update_product/:id",
    TokenVerification.userTokenValidation,
    ProductController.updateProduct
);

//  Delete Single Product
productRouter.delete(
    "/delete_product/:id",
    TokenVerification.userTokenValidation,
    ProductController.deleteProduct
);

//  Uploading Users Profile Picture.
productRouter.put(
    "/upload_product_images/:id",
    TokenVerification.userTokenValidation,
    productImageUpload,
    ProductController.uploadProductImage
);

export default productRouter;