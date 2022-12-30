'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import WalletController from "../controllers/wallet_controller";



//  Set up Express Router.
const walletRouter = Router();

//  Create a Wallet.
walletRouter.post(
    "/create_wallet",
    WalletController.creteWallet
);

//  Get All Wallets.
walletRouter.get(
    "/all_wallets",
    TokenVerification.userTokenValidation,
    WalletController.getAllWallets
);

//  Get Single Wallet.
walletRouter.get(
    "/single_wallet",
    TokenVerification.userTokenValidation,
    WalletController.getSingleWallet
);

//  Get Single Wallet.
walletRouter.put(
    "/update_wallet",
    TokenVerification.userTokenValidation,
    WalletController.updateWallet
);

export default walletRouter;