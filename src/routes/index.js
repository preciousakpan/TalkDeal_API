'use strict';

import { Router } from 'express';

//  Import all the required routes.
import userRouter from "./user_routes";
import driverRouter from "./driver_routes";
import otpRouter from "./otp_routes";
import productRouter from "./product_routes";
import bidRouter from "./bid_routes";



//  Initialize Express Router.
const router = Router();

router.use('/users', userRouter);
router.use('/drivers', driverRouter);
router.use('/otp', otpRouter);
router.use('/products', productRouter);
router.use('/bids', bidRouter);

export default router;
