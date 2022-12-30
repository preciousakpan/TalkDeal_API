'use strict';

import jwt from "jsonwebtoken";
import bCrypt from "bcryptjs";
import otpGenerator from 'otp-generator';
import models from "../database/models";
import JoiValidator from "../utils/joi_validator";
import Response from "../utils/response";
import SendOTPMail from "../utils/send_otp_mail";

const { Drivers, OTP } = models;


class DriverController {

    //  Drivers SignUp.
    static signUpDriver = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log("DRIVERS DATA::: ", value);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.driversSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if Driver already exist and create a new Drivers.
            const [driver, created] = await Drivers.findOrCreate({
                where: { email: value.email },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "Driver already registered. Kindly login with your credentials."
                );
                return res.status(response.code).json(response);
            }
            const { id, name, email, phone } = driver;

            // Generate a Six digits token.
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            console.log("GEN OTP::: ", otp);

            //  Save OTP to the DB
            await OTP.create({
                email: value.email,
                otp: otp,
            });


            //  Send OTP to drivers mail.
            await SendOTPMail.sendMail(name, email, otp);
            // const emailResponse = await SendOTPMail.sendMail(name, email, otp);
            // console.log("EMAIL RESPONSE::: ", emailResponse.response);

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone },
                `${process.env.JWT_SECRET_KEY}`,
            );

            //  Now remove the "password" before returning the Driver.
            const driverDataValues = driver.dataValues;


            const response = new Response(
                true,
                201,
                "Successfully registered. Kindly check your email for your OTP.",
                { ...driverDataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Driver Login.
    static loginDriver = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.driversLoginSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Find the driver.
            const driver = await Drivers.findOne({
                where: { email: value.email },
            });
            if (!driver) {
                const response = new Response(
                    false,
                    404,
                    "Incorrect email. Please check your email and try again."
                );
                return res.status(response.code).json(response);
            }
            const { id, name, email, phone } = driver;

            //  Compare the encrypted password.
            const isPasswordMatched = bCrypt.compareSync(value.password, driver.password);
            if (!isPasswordMatched) {
                const response = new Response(
                    false,
                    401,
                    "Incorrect password. Please check your password and try again."
                );
                return res.status(response.code).json(response);
            }

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone },
                `${process.env.JWT_SECRET_KEY}`,
            );

            //  Now remove the "password" before returning the Driver.
            const driverDataValues = driver.dataValues;
            delete driverDataValues.password;

            //  Check if driver is verified.
            /*if (driver.isVerified === false) {
                const response = new Response(
                    true,
                    200,
                    "Account is not verified. Kindly check your email for your OTP.",
                    { ...driverDataValues, token }
                );
                return res.status(response.code).json(response);
            }*/

            const response = new Response(
                true,
                200,
                "You're logged in successfully.",
                { ...driverDataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Drivers.
    static getAllDrivers = async (req, res) => {
        try {
            const drivers = await Drivers.findAll({
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!drivers.length) {
                const response = new Response(
                    false,
                    404,
                    "No driver found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Drivers retrieved successfully.',
                drivers
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Driver.
    static getSingleDriver = async (req, res) => {
        try {
            const { id } = req.params;

            const driver = await Drivers.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!driver) {
                const response = new Response(
                    false,
                    404,
                    "Driver does not exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Driver retrieved successfully.',
                driver
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Update a Driver.
    static updateDriver = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;
            // console.log(requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.driversUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            if (value.email) {
                const foundDriver = await Drivers.findOne({
                    where: { id }
                });

                //  First check if the driver Email is changed, then resend verification mail.
                if (foundDriver.email !== value.email) {
                    const updatedDriver = await Drivers.update({ ...value, isVerified: false }, { where: { id } });
                    if (updatedDriver[0] === 0) {
                        const response = new Response(
                            false,
                            400,
                            "Failed to update driver."
                        );
                        return res.status(response.code).json(response);
                    }


                    //  Get the driver back.
                    const driver = await Drivers.findOne({
                        where: { id },
                        attributes: {
                            exclude: ["password"]
                        }
                    });
                    const { name, email, phone } = driver;

                    // Generate a Six digits token.
                    const otp = otpGenerator.generate(6, {
                        digits: true,
                        lowerCaseAlphabets: false,
                        upperCaseAlphabets: false,
                        specialChars: false
                    });
                    console.log("GEN OTP::: ", otp);

                    //  Save OTP to the DB
                    await OTP.create({
                        driverEmail: email,
                        otp: otp,
                    });


                    //  Send OTP to drivers mail.
                    await SendOTPMail.sendMail(name, email, otp);
                    // const emailResponse = await SendOTPMail.sendMail(name, email, otp);
                    // console.log("EMAIL RESPONSE::: ", emailResponse);


                    //  Create a Token that will be passed to the response.
                    const token = jwt.sign(
                        { id, name, email, phone, role },
                        `${process.env.JWT_SECRET_KEY}`,
                    );

                    const response = new Response(
                        true,
                        200,
                        "Successfully updated. Kindly check your email for your OTP verification.",
                        { ...driver.dataValues, token }
                    );
                    return res.status(response.code).json(response);
                }

                //  If Not, then return.
                return;
            }

            const updatedDriver = await Drivers.update({ ...value }, { where: { id } });
            if (updatedDriver[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update driver."
                );
                return res.status(response.code).json(response);
            }

            //  Get the driver back.
            const driver = await Drivers.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            const { name, email, phone, role } = driver;

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            const response = new Response(
                true,
                200,
                "Account updated successfully.",
                { ...driver.dataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Delete a Driver.
    static deleteDriver = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Drivers.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No driver found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Driver deleted successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Upload Driver's Profile Picture.
    static uploadDriverProfilePicture = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const filename = req.file.filename;
            const avatarURL = `http://${req.headers.host}/images/profile_pictures/${filename}`;
            // console.log("IMAGE FILE:::", req.file);

            //  Update the Drivers Profile Picture..
            const updatedDriver = await Drivers.update(
                { picture: avatarURL },
                { where: { id } }
            );
            if (updatedDriver[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update profile picture."
                );
                return res.status(response.code).json(response);
            }

            //  Get the driver back.
            const driver = await Drivers.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            const { name, email, phone } = driver;


            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone },
                `${process.env.JWT_SECRET_KEY}`,
            );

            const response = new Response(
                true,
                200,
                'Successfully uploaded drivers image.',
                { ...driver.dataValues, token }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error.message}`);

            const response = new Response(
                false,
                504,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };
}

export default DriverController;