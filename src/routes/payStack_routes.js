"use strict";

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import PayStackController from "../controllers/payStack_controller";

//  Set up Express Router.
const payStackRouter = Router();

//  Make Payment with PayStack.
payStackRouter.post(
    "/make_payment",
    TokenVerification.userTokenValidation,
    PayStackController.makePaymentWithPayStack
);

//  Verify PayStack Payment
payStackRouter.get(
    "/verify_payment/:referenceNumber",
    TokenVerification.userTokenValidation,
    PayStackController.verifyPaymentWithPayStack
);

export default payStackRouter;