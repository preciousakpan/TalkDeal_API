"use strict";

const payStackConfig = (request) => {
    //  Initialize PayStack Payment.
    const initializePayment = (form, mCallback) => {
        const options = {
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
                "Authorization": `Bearer ${process.env.PAYSTACK_TEXT_SECRET_KEY}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            form
        };

        const callback = (error, response, body) => {
            return mCallback(error, body);
        };

        request.post(options, callback);
    };

    //  Verify Your PayStack Payment.
    const verifyPayment = (ref, mCallback) => {
        const options = {
            url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
            headers: {
                "Authorization": `Bearer ${process.env.PAYSTACK_TEXT_SECRET_KEY}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            form
        };

        const callback = (error, response, body) => {
            return mCallback(error, body);
        };
        request.get(options, callback);
    };

    return { initializePayment, verifyPayment };
};

export default payStackConfig;