"use strict";

import models from "../database/models";
import Response from "../utils/response";

const { Carts, Products } = models;

class CartController {

    //  Get all Users Cart.
    static getUsersCart = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            // console.log("IDDDD::: ", id);

            const carts = await Carts.findAll({
                where: { bidderId: id },
            });
            if (!carts.length) {
                const response = new Response(
                    true,
                    200,
                    "Your cart is empty.",
                    carts
                );
                return res.status(response.code).json(response);
            }

            let allCartItems = [];
            for (const eachCart of carts) {
                const product = await Products.findOne({
                    where: { id: eachCart.productId },
                });
                allCartItems.push(product.dataValues);
            }
            // console.log(allCartItems);

            const response = new Response(
                true,
                200,
                'Carts retrieved successfully.',
                allCartItems
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
}

export default CartController;