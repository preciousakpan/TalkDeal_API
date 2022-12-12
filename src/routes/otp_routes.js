'use strict';

import { Router } from 'express';
import OTPController from '../controllers/otp_controller';
import TokenVerification from "../utils/token_verification";

//  Set up Express Router.
const otpRouter = Router();

//  Send OTP.
otpRouter.post(
    "/send_otp",
    TokenVerification.userTokenValidation,
    OTPController.sendOTPMail
);

//  Verify User OTP.
otpRouter.post(
    "/verify_user_otp/:id",
    TokenVerification.userTokenValidation,
    OTPController.verifyUserOTP
);

//  Verify Driver OTP.
otpRouter.post(
    "/verify_driver_otp",
    TokenVerification.driverTokenVerification,
    OTPController.verifyDriverOTP
);


export default otpRouter;