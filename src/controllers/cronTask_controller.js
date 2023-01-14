"use strict";

import nodeCron from "node-cron";
import models from "../database/models";
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";

const { Bids, Carts, Products } = models;

class CronTaskController {

    static checkProductWonCronTask = () => {
        // Schedule tasks to be run on the server.
        return nodeCron.schedule("* * * * *", async (req, res) => {
            // console.log("Running this task Every 10 Seconds...");

            const currentDateTime = new Date();
            //  Get all Products.
            try {
                const products = await Products.findAll();
                if (!products.length) {
                    console.log("No product found.");
                    const response = new Response(
                        false,
                        404,
                        "No product found."
                    );
                    return res.status(response.code).json(response);
                }

                products.map(async (eachProduct) => {
                    if (currentDateTime > new Date(eachProduct.dueDate) && eachProduct.status === "Available") {
                        //  Update a Product.
                        await Products.update({ status: "Not Available" }, { where: { id: eachProduct.id } });

                        //  Check the Bid table and check the highest bid for that Product.
                        const bids = await Bids.findAll({
                            where: { productId: eachProduct.id },
                            order: [
                                ['currentBidPrice', 'DESC'],
                            ],
                            limit: 1,
                        });
                        const bid = bids[0].dataValues;

                        const newCart = {
                            productId: bid.productId,
                            bidderId: bid.bidderId,
                            bidderName: bid.bidderName,
                            currentBidPrice: bid.currentBidPrice,
                        }
                        console.log(newCart);

                        //  Create a Cart.
                        const cart = await Carts.create({ ...newCart });
                    }
                });

            } catch (error) {
                console.log(`ERROR::: ${error}`);

                const response = new Response(
                    false,
                    500,
                    'Server error, please try again later.'
                );
                return res.status(response.code).json(response);
            }
        });
    };
}

export default CronTaskController;






/**
 These asterisks are part of the cron tab syntax to represent different units of time:

 * * * * * *
 | | | | | |
 | | | | | day of week
 | | | | month
 | | | day of month
 | | hour
 | minute
 second ( optional )

 ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of the month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
 │ │ │ │ │
 │ │ │ │ │
 │ │ │ │ │
 * * * * *

 * */