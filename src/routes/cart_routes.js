'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import CartController from "../controllers/cart_controller";


//  Set up Express Router.
const cartRouter = Router();

cartRouter.get(
    "/all_user_carts",
    TokenVerification.userTokenValidation,
    CartController.getUsersCart
);

export default cartRouter;