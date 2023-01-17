import { promises as fs } from "fs";
import models from "../database/models";
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";
import { Op } from "sequelize";

const { Products } = models;

class ProductController {
    //  Create Product.
    static createProduct = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const requestBody = req.body;
            // console.log("IDDDD::: ", id);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.productSchema.validate({ ...requestBody, ownerId: id });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }
            // console.log("PRODUCT::: ", value);

            //  Check if Product already exist and create a new Product.
            const [product, created] = await Products.findOrCreate({
                where: { name: value.name },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "Product already created. Kindly create another product with different names."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                "Successfully created a new product.",
                product
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Products.
    static getAllProducts = async (req, res) => {
        try {
            const products = await Products.findAll({
                where: {
                    dueDate: {
                        [Op.gt]: new Date(),
                    }
                }
            });
            if (!products.length) {
                const response = new Response(
                    false,
                    404,
                    "No product found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Products retrieved successfully.',
                products
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Product.
    static getSingleProduct = async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Products.findOne({
                where: { id }
            });
            if (!product) {
                const response = new Response(
                    false,
                    404,
                    "Product does not exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Product retrieved successfully.',
                product
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Update a Product.
    static updateProduct = async (req, res) => {
        try {
            const { id: ownerId } = req.requestPayload;
            const { id } = req.params;
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.productUpdateSchema.validate({ ...requestBody, ownerId });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            const updatedProduct = await Products.update({ ...value }, { where: { id } });
            if (updatedProduct[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update product."
                );
                return res.status(response.code).json(response);
            }

            //  Get the user back.
            const product = await Products.findOne({
                where: { id },
            });

            const response = new Response(
                true,
                200,
                "Product updated successfully.",
                product
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Delete a Product.
    static deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;

            const { images } = await Products.findOne({
                where: { id }
            });
            // console.log("IMAGES::: ", images);

            //  First delete the Product.
            const isDeleted = await Products.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No product found."
                );
                return res.status(response.code).json(response);
            }

            //  Then, delete the corresponding Images.
            for (const eachImage of images) {
                // console.log("RESULT222::: ", __dirname.split("/src/controllers")[0] + "/public/images/products" + eachImage.split("/images/products")[1]);
                await fs.unlink(__dirname.split("/src/controllers")[0] + "/public/images/products" + eachImage.split("/images/products")[1]);
            }

            const response = new Response(
                true,
                200,
                "Product deleted successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Upload Product Image.
    static uploadProductImage = async (req, res) => {
        try {
            const { id } = req.params;
            const productURLs = req.files.map((eachFile) => {
                return `http://${req.headers.host}/images/products/${eachFile.filename}`;
            });
            // console.log("ID::: ", id);
            // console.log("FILES::: ", req.files[0]);
            // console.log("HOST::: ", req.headers.host);

            //  Update the Users Profile Picture..
            const updatedProduct = await Products.update(
                { images: productURLs },
                { where: { id } }
            );
            if (updatedProduct[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to upload product image."
                );
                return res.status(response.code).json(response);
            }

            //  Get the user back.
            const product = await Products.findOne({
                where: { id },
            });

            const response = new Response(
                true,
                200,
                "Product image uploaded successfully.",
                product
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error.message}`);

            const response = new Response(
                false,
                504,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };
}

export default ProductController;