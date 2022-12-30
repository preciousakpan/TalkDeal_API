"use strict";

import axios from "axios";
import { v4 as uuidV4 } from 'uuid';
import models from "../database/models";
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";

const { Transactions, Wallets } = models;


class PayStackController {

    //  Make Payment with PayStack.
    static makePaymentWithPayStack = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log("REQUEST BODY:::", requestBody);

            const paymentData = {
                full_name: requestBody.full_name,
                email: requestBody.email,
                amount: requestBody.amount * 100,
                reference: uuidV4(),
            }

            const responseData = await axios({
                method: "post",
                url: "https://api.paystack.co/transaction/initialize",
                data: paymentData,
                headers: {
                    "Authorization": `Bearer ${process.env.PAYSTACK_TEXT_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
            });
            if(!responseData.data.status){
                const response = new Response(
                    false,
                    400,
                    `${responseData.data.message}`,
                );
                return res.status(response.code).json(response);
            }

            // console.log("PAYSTACK RESPONSE::: ", responseData.data);
            const response = new Response(
                true,
                200,
                "Payment was initiated successfully.",
                responseData.data.data
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

    //  Verify PayStack Payment.
    static verifyPaymentWithPayStack = async (req, res) => {
        try {
            const { id: userId } = req.requestPayload;
            const { referenceNumber } = req.params;
            // console.log("REQUEST BODY:::", referenceNumber);

            const responseData = await axios({
                method: "get",
                url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(referenceNumber)}`,
                headers: {
                    "Authorization": `Bearer ${process.env.PAYSTACK_TEXT_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
            });
            if(!responseData.data.status){
                const response = new Response(
                    false,
                    400,
                    `${responseData.data.message}`,
                );
                return res.status(response.code).json(response);
            }
            const { id, amount, reference, status, transaction_date: transactionDate } = responseData.data.data;

            //  Get the previous Amount.
            const { amount: prevAmount } = await Wallets.findOne({
                where: { userId },
            });
            const newAmount = prevAmount + (amount / 100);

            //  Update the Users Wallet
            const updatedWallet = await Wallets.update({ amount: newAmount }, { where: { userId } });
            if (updatedWallet[0] === 0) {
                const response = new Response(
                    false,
                    404,
                    "Failed to update wallet."
                );
                return res.status(response.code).json(response);
            }

            const transactionBody = {
                talkDealTransactionId: `TD_${uuidV4().split("-")[0]}${uuidV4().split("-")[4]}`,
                payStackTransactionId: id,
                userId,
                amount: amount / 100,
                reference,
                status,
                reason: "Recharge Wallet",
                transactionDate,
            };

            //  Validate the Transaction Body.
            const { error, value } = JoiValidator.transactionSchema.validate({ ...transactionBody });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Create Payment Transaction.
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
                "Payment transaction was made successfully.",
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
}

export default PayStackController;