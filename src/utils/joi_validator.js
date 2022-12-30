'use strict';

import Joi from 'joi';

const role = ["Admin", "Bidder", "Driver"];
const accountStatus = ["Active", "Inactive"];
const transactionStatus = ["Pending", "Assigned", "In Transit", "Delivered"];
const categories = ["All Categories", "Computing", "Electronics", "Sporting", "Phones & Tablets", "Toys", "Fashion", "Home & Office", "Automobile", "Health & Beauty", "Babies"];
const logisticType = ["Truck", "Small Car", "Motor Cycle"];

class JoiValidator {

    /*=====================================================================================*/
    /*=================================== FOR USERS =====================================*/
    //  Users Validation Schema.
    static usersSchema = Joi.object({
        name: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        status: Joi.string().valid(...accountStatus),
        isVerified: Joi.boolean(),
        picture: Joi.string(),
        password: Joi.string().required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
    });

    //  Users Update Validation Schema.
    static usersUpdateSchema = Joi.object({
        name: Joi.string().min(3),
        phone: Joi.string(),
        email: Joi.string().email(),
        status: Joi.string().valid(...accountStatus),
        isVerified: Joi.boolean(),
        picture: Joi.string(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric."))
    });

    //  User Login Validation Schema.
    static usersLoginSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });


    /*=====================================================================================*/
    /*=================================== FOR USERS =====================================*/
    //  Driver Validation Schema.
    static driversSchema = Joi.object({
        name: Joi.string().required().min(3),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        location:Joi.array().items(Joi.string()),
        address: Joi.string(),
        logisticType: Joi.string().valid(...logisticType),
        picture: Joi.string(),
        status: Joi.string().valid(...accountStatus),
        isVerified: Joi.boolean(),
        password: Joi.string().required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
    });

    //  Driver Update Validation Schema.
    static driversUpdateSchema = Joi.object({
        name: Joi.string().min(3),
        email: Joi.string().email(),
        phone: Joi.string(),
        location:Joi.array().items(Joi.string()),
        address: Joi.string(),
        logisticType: Joi.string().valid(...logisticType),
        picture: Joi.string(),
        status: Joi.string().valid(...accountStatus),
        isVerified: Joi.boolean(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
    });

    //  User Login Validation Schema.
    static driversLoginSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });


    /*=====================================================================================*/
    /*=================================== FOR OTP =====================================*/

    //  OTP Validation Schema.
    static otpSchema = Joi.object({
        email: Joi.string().required().email(),
    });

    //  OTP Verification Schema.
    static verifyOTPSchema = Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.string().required(),
    });
    

    /*=====================================================================================*/
    /*=================================== FOR PRODUCT =====================================*/
    //  Product Validation Schema.
    static productSchema = Joi.object({
        name: Joi.string().required().min(3),
        category: Joi.string().required().valid(...categories),
        initialPrice: Joi.number().required(),
        finalPrice: Joi.number(),
        count: Joi.number().required(),
        weight: Joi.number().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        description: Joi.string().required(),
        ownerId: Joi.string().required(),
        dueDate: Joi.date().required(),
        images: Joi.array(),
    });

    //  Podcasts Update Validation Schema.
    static productUpdateSchema = Joi.object({
        name: Joi.string().min(3),
        category: Joi.string().valid(...categories),
        initialPrice: Joi.number(),
        finalPrice: Joi.number(),
        count: Joi.number(),
        weight: Joi.string(),
        state: Joi.string(),
        city: Joi.string(),
        description: Joi.string(),
        ownerId: Joi.string(),
        dueDate: Joi.date(),
        images: Joi.array(),
    });
    

    /*=====================================================================================*/
    /*=================================== FOR BIDS =====================================*/
    //  Bid Validation Schema.
    static bidSchema = Joi.object({
        productId: Joi.string().required(),
        bidderId: Joi.string().required(),
        bidderName: Joi.string().required(),
        currentBidPrice: Joi.number().required(),
    });


    /*=====================================================================================*/
    /*=================================== FOR BIDS =====================================*/
    //  Bid Validation Schema.
    static walletSchema = Joi.object({
        userId: Joi.string().required(),
        amount: Joi.number(),
    });


    /*=====================================================================================*/
    /*=================================== FOR BIDS =====================================*/
    //  Bid Validation Schema.
    static transactionSchema = Joi.object({
        talkDealTransactionId: Joi.string().required(),
        payStackTransactionId: Joi.number().required(),
        userId: Joi.string().required(),
        amount: Joi.number().required(),
        reference: Joi.string().required(),
        status: Joi.string().required(),
        reason: Joi.string().required(),
        transactionDate: Joi.string().required(),
    });
}

export default JoiValidator;
