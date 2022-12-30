'use strict';

import { Router } from 'express';

//  Import all the required routes.
import userRouter from "./user_routes";
import driverRouter from "./driver_routes";
import otpRouter from "./otp_routes";
import productRouter from "./product_routes";
import bidRouter from "./bid_routes";
import payStackRouter from "./payStack_routes";
import walletRouter from "./wallet_routes";
import transactionRouter from "./transaction_routes";



//  Initialize Express Router.
const router = Router();

router.use('/users', userRouter);
router.use('/drivers', driverRouter);
router.use('/otp', otpRouter);
router.use('/products', productRouter);
router.use('/bids', bidRouter);
router.use('/paystack', payStackRouter);
router.use('/wallets', walletRouter);
router.use('/transactions', transactionRouter);

export default router;
