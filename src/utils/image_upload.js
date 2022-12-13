'use strict';

import multer from 'multer';
import path from "path";
import Response from './response';

// Multer Storage Method For Profile Pictures.
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/images/profile_pictures");
    },
    filename: (req, file, callback) => {
        const { id } = req.requestPayload;  //  User ID
        callback(null, id + '_' + 'profile_photo' + path.extname(file.originalname));
    }
});

// Multer Storage Method For Product Pictures.
const productPictureStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/images/products");
    },
    filename: (req, file, callback) => {
        const { id } = req.params;  //  Product ID
        callback(null, id + "_" + file.originalname);
    }
});

// Multer File Filter.
const imageFilter = (req, file, callback) => {
    //  Get the File Extension name.
    const extName = path.extname(file.originalname).toLowerCase();

    //  Allowed Extensions.
    if (extName === ".jpg" || extName === ".jpeg" || extName === ".png") {
        return callback(null, true);
    }
    return callback({ message: 'ExtensionError; Please select JPG, JPEG or PNG images only.' }, false);
} ;


// Multer Object For User Profile Picture.
const userProfileUpload = multer({
    storage: profilePictureStorage,
    fileFilter: imageFilter,
    limits: {fileSize: 1000 * 1000},
}).single('profilePicture');
const userProfilePictureUpload = (req, res, next) => {
    userProfileUpload(req, res, (error) => {
        if(error) {
            const response = new Response(
                false,
                400,
                (error.message) ? `Error: ${error.message}` : error
            );
            return res.status(response.code).json(response);
        }
        return next();
    });
}

// Multer Object For Product Images.
const productUpload = multer({
    storage: productPictureStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 1024 * 1024 },
}).array('productImages', 4);
const productImageUpload = (req, res, next) => {
    productUpload(req, res, (error) => {
        if(error) {
            const response = new Response(
                false,
                410,
                (error.message) ? `Error: ${error.message}` : error
            );
            return res.status(response.code).json(response);
        }
        return next();
    });
}

export { userProfilePictureUpload, productImageUpload  };
