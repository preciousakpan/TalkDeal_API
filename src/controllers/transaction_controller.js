"use strict";

import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";
import models from "../database/models";

const { Transactions } = models;


class TransactionController {

    //  Create Transaction.
    static creteTransaction = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log("REQUEST BODY::: ", requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.transactionSchema.validate({ ...requestBody });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Create a Transaction.
            const transaction = await Transactions.create({ ...value });
            if (!transaction) {
                const response = new Response(
                    false,
                    409,
                    "Transaction creation failed."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                "Successfully created a new transaction.",
                transaction
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

    //  Get All Transactions.
    static getAllTransactions = async (req, res) => {
        try {
            const transactions = await Transactions.findAll();
            if (!transactions.length) {
                const response = new Response(
                    false,
                    404,
                    "No transactions yet."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Transactions retrieved successfully.',
                transactions
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

    //  Get User Transactions.
    static getUserTransactions = async (req, res) => {
        try {
            const { id } = req.requestPayload;

            const transactions = await Transactions.findAll({
                where: { userId: id },
            });
            if (!transactions.length) {
                const response = new Response(
                    false,
                    404,
                    "No transactions yet."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Transactions retrieved successfully.',
                transactions
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

    //  Get Single Transaction.
    static getSingleTransaction = async (req, res) => {
        try {
            const { id } = req.params;

            const transactions = await Transactions.findOne({
                where: { id },
            });
            if (!transactions) {
                const response = new Response(
                    false,
                    404,
                    "Transaction does not exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Transactions retrieved successfully.',
                transactions
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

export default TransactionController;