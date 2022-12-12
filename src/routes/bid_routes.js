'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import BidController from "../controllers/bid_controller";



//  Set up Express Router.
const bidRouter = Router();

//  Create a Bid.
bidRouter.post(
    "/create_bid",
    TokenVerification.userTokenValidation,
    BidController.createBid
);

//  Get All Bids.
bidRouter.get(
    "/all_bids",
    TokenVerification.userTokenValidation,
    BidController.getAllBids
);

//  Get All Product Bid.
bidRouter.get(
    "/product_bid/:id",
    TokenVerification.userTokenValidation,
    BidController.getProductBids
);

export default bidRouter;