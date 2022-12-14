'use strict';

import { Router } from 'express';
import DriverController from "../controllers/driver_controller";
import TokenVerification from "../utils/token_verification";
import {userProfilePictureUpload} from "../utils/image_upload";


//  Set up Express Router.
const driverRouter = Router();

//  Drivers SignUp.
driverRouter.post(
    "/signup",
    DriverController.signUpDriver
);

//  Driver Login.
driverRouter.post(
    "/login",
    DriverController.loginDriver
);

//  Get all Drivers.
driverRouter.get(
    "/all_drivers",
    TokenVerification.driverTokenVerification,
    DriverController.getAllDrivers
);

//  Get a single Driver.
driverRouter.get(
    "/single_driver/:id",
    TokenVerification.driverTokenVerification,
    DriverController.getSingleDriver
);

//  Update a Driver.
driverRouter.put(
    "/update_driver/:id",
    TokenVerification.userTokenValidation,
    DriverController.updateDriver
);

//  Delete a Driver.
driverRouter.delete(
    "/delete_driver/:id",
    TokenVerification.driverTokenVerification,
    DriverController.deleteDriver
);

//  Upload Driver's Profile Picture.
driverRouter.put(
    "/upload_driver_picture",
    TokenVerification.driverTokenVerification,
    userProfilePictureUpload,
    DriverController.uploadDriverProfilePicture
);

export default driverRouter;