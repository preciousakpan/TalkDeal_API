'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import TransactionController from "../controllers/transaction_controller";



//  Set up Express Router.
const transactionRouter = Router();

//  Create a Transaction.
transactionRouter.post(
    "/create_transaction",
    TransactionController.creteTransaction
);

//  Get All Transactions.
transactionRouter.get(
    "/all_transactions",
    TokenVerification.userTokenValidation,
    TransactionController.getAllTransactions
);

//  Get User Transactions.
transactionRouter.get(
    "/all_user_transactions",
    TokenVerification.userTokenValidation,
    TransactionController.getUserTransactions
);

//  Get Single Transaction.
transactionRouter.get(
    "/single_transaction/:id",
    TokenVerification.userTokenValidation,
    TransactionController.getSingleTransaction
);

export default transactionRouter;