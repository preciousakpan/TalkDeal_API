"use strict";

import nodeCron from "node-cron";
import models from "../database/models";
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";

const { Products } = models;

class CronTaskController {

    static checkProductWonCronTask = () => {
        // Schedule tasks to be run on the server.
        return nodeCron.schedule("*/10 * * * * *", async (req, res) => {
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
                    if (currentDateTime > new Date(eachProduct.dueDate)) {
                        //  Update a Product.
                        await Products.update({ status: "Not Available" }, { where: { id: eachProduct.id } });
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