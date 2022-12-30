"use strict";

import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";
import models from "../database/models";

const { Wallets, Users } = models;

class WalletController {

    //  Create Wallet.
    static creteWallet = async (req, res) => {
        try {
            const requestBody = req.body;
            console.log("REQUEST BODY::: ", requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.walletSchema.validate({ ...requestBody });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Create a Wallet.
            const wallet = await Wallets.create({ ...value });
            if (!wallet) {
                const response = new Response(
                    false,
                    409,
                    "Wallet creation failed."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                "Successfully created a new wallet.",
                wallet
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

    //  Get All Wallets.
    static getAllWallets = async (req, res) => {
        try {
            const wallets = await Wallets.findAll();
            if (!wallets.length) {
                const response = new Response(
                    false,
                    404,
                    "No wallet yet."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Wallets retrieved successfully.',
                wallets
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

    //  Get Single Wallet.
    static getSingleWallet = async (req, res) => {
        try {
            const { id } = req.requestPayload;

            const wallet = await Wallets.findOne({
                where: { userId: id },
            });
            if (!wallet) {
                const response = new Response(
                    false,
                    404,
                    "Wallet does not exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Wallet retrieved successfully.',
                wallet
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

    //  Update a Wallets.
    static updateWallet = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const { amount } = req.body;

            //  Get the previous Amount.
            const { amount: prevAmount } = await Wallets.findOne({
                where: { userId: id },
            });

            const updatedWallet = await Wallets.update({ amount: prevAmount + amount }, { where: { userId: id } });
            if (updatedWallet[0] === 0) {
                const response = new Response(
                    false,
                    404,
                    "Failed to update wallet."
                );
                return res.status(response.code).json(response);
            }

            const newlyUpdatedWallet = await Wallets.findOne({
                where: { userId: id },
            });

            const response = new Response(
                true,
                200,
                'Wallet updated successfully.',
                newlyUpdatedWallet
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

export default WalletController;