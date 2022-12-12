import models from "../database/models";
import JoiValidator from "../utils/joi_validator";
import Response from "../utils/response";

const { Bids, Users, Products } = models;

class BidController {
    //  Create Bid.
    static createBid = async (req, res) => {
        try {
            const { id: bidderId, name: bidderName } = req.requestPayload;
            const requestBody = req.body;
            // console.log("IDDDD::: ", requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.bidSchema.validate({ ...requestBody, bidderId, bidderName });
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Create a bid.
            const bid = await Bids.create({ ...value });
            if (!bid) {
                const response = new Response(
                    false,
                    409,
                    "Bid creation failed."
                );
                return res.status(response.code).json(response);
            }
            const { productId, currentBidPrice, createdAt } = bid;
            console.log(productId, currentBidPrice);

            //  Update Product "finalPrice"
            await Products.update({ finalPrice: currentBidPrice }, { where: { id: productId } });

            //  Get that Single Product.
            /*const { initialPrice, dueDate } = await Products.findOne({
                where: { id: productId },
                /!*attributes: {
                    include: ["initialPrice"]
                }*!/
            });*/

            //  Get that Single Bidder.
            const { location, picture } = await Users.findOne({
                where: { id: bidderId },
            });

            const response = new Response(
                true,
                201,
                "Successfully created a new product.",
                { productId, bidderId, bidderName, location, picture, currentBidPrice, createdAt }
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

    //  Get all Bids.
    static getAllBids = async (req, res) => {
        try {
            const bids = await Bids.findAll({
                order: [
                    ['currentBidPrice', 'DESC'],
                ],
            });
            if (!bids.length) {
                const response = new Response(
                    false,
                    404,
                    "No bid yet."
                );
                return res.status(response.code).json(response);
            }

            let allBids = [];
            for (const eachBid of bids) {
                const { email: bidderEmail, picture: bidderImage } = await Users.findOne({
                    where: { id: eachBid.bidderId },
                });

                allBids.push({
                    ...eachBid.dataValues, bidderEmail, bidderImage
                });
            }

            const response = new Response(
                true,
                200,
                'Bids retrieved successfully.',
                allBids
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

    //  Get all Products.
    static getProductBids = async (req, res) => {
        try {
            const { id } = req.params;

            const bids = await Bids.findAll({
                where: { productId: id },
                order: [
                    ['currentBidPrice', 'DESC'],
                ],
            });
            if (!bids.length) {
                const response = new Response(
                    true,
                    200,
                    "No bid yet.",
                    bids
                );
                return res.status(response.code).json(response);
            }

            let allBids = [];
            for (const eachBid of bids) {
                const { email, picture: bidderImage } = await Users.findOne({
                    where: { id: eachBid.bidderId },
                });

                allBids.push({
                    ...eachBid.dataValues, bidderEmail: email, bidderImage
                });
            }

            const response = new Response(
                true,
                200,
                'Bids retrieved successfully.',
                allBids
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
}

export default BidController;