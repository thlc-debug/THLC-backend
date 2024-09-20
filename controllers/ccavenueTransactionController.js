const crypto = require("crypto");
const ccav = require("../utils/ccavenueUtils");
const qs = require("querystring");
const Reservation = require("../Models/Reservation");
const Transaction = require("../Models/transaction");

const CC = require("currency-converter-lt");

const createCCAvenueOrder = async (req, res) => {
  const {
    name,
    email,
    phone,
    no_of_people,
    check_in,
    check_out,
    user_id,
    hotel_id,
    price,
    currency,
  } = req.body;

  const reservationDetails = new Reservation({
    name: name,
    email: email,
    phone: phone,
    no_of_people: no_of_people,
    check_in: check_in,
    check_out: check_out,
    user_id: user_id,
    hotel_id: hotel_id,
    price: price,
    status: "pending",
  });

  const newReservation = await reservationDetails.save();

  const newTransaction = new Transaction({
    reservationId: newReservation._id,
    userId: user_id,
    amount: price,
    currency: currency,
    paymentMethod: "Net Banking",
    paymentStatus: "Pending",
  });

  const savedTransaction = await newTransaction.save();

  try {
    const cc = new CC({
      from: currency,
      to: "INR",
      amount: price,
    });

    console.log("Converted amount:", convertedAmount);

    let body = "",
      workingKey = process.env.CC_WORKING_KEY,
      accessCode = process.env.CC_ACCESS_CODE,
      encRequest = "",
      formbody = "";

    const data = {
      // merchant_id: process.env.CC_MERCHANT_ID,
      order_id: savedTransaction._id,
      currency: "INR",
      amount: convertedAmount.toFixed(2),
      redirect_url: encodeURIComponent(process.env.CC_REDIRECT_URI),
      cancel_url: encodeURIComponent(process.env.CC_CANCEL_URI),
      language: "EN",
      billing_name: name,
      billing_tel: phone,
      billing_email: email,
    };

    let newData = `merchant_id=${process.env.CC_MERCHANT_ID}`;

    newData += Object.entries(data)
      .map(([key, value]) => `&${key}=${value}`)
      .join("");

    encRequest = ccav.encrypt(newData);

    formbody =
      '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
      encRequest +
      '"><input type="hidden" name="access_code" id="access_code" value="' +
      accessCode +
      '"><script language="javascript">document.redirect.submit();</script></form>';

    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(formbody);
    res.end();
    return;
  } catch (error) {
    console.error("Failed to create order:", error);

    // delete transaction and reservation if order creation fails
    const deleteReservation = await Reservation.deleteOne({
      _id: newReservation._id,
    });

    const deleteTransaction = await Transaction.deleteOne({
      _id: savedTransaction._id,
    });

    console.log(deleteReservation, deleteTransaction);

    res.status(500).json({ error: "Failed to create order." });
  }
};

const ccAvenueResponseHandler = async (req, res) => {
  try {
    let ccavEncResponse = "",
      ccavResponse = "",
      workingKey = process.env.CC_MERCHANT_ID,
      ccavPOST = "";

    req.on("data", function (data) {
      ccavEncResponse += data;
      ccavPOST = qs.parse(ccavEncResponse);
      let encryption = ccavPOST.encResp;
      ccavResponse = ccav.decrypt(encryption);
    });

    req.on("end", async () => {
      try {
        const responseData = ccavResponse.split("&").reduce((acc, pair) => {
          const [key, value] = pair.split("=");
          try {
            acc[key] = decodeURIComponent(value);
          } catch (error) {
            // console.error(`Failed to decode URI component: ${value}`, error);
            acc[key] = value; // Fallback to the raw value if decoding fails
          }
          return acc;
        }, {});

        const transaction = await Transaction.findOne({
          _id: responseData.order_id,
        });
        const reservation = await Reservation.findOne({
          _id: transaction.reservationId,
        });

        transaction.transactionId = responseData.tracking_id;

        if (responseData.order_status === "Success") {
          transaction.paymentStatus = "Completed";
          reservation.status = "confirmed";
          reservation.is_payment_done = true;
        } else {
          transaction.paymentStatus = "Failed";
          reservation.status = "cancelled";
          reservation.is_payment_done = false;
        }

        await transaction.save();
        await reservation.save();

        const respData = {
          orderId: responseData.order_id,
          transactionId: responseData.tracking_id,
          paymentMethod: responseData.payment_mode,
          bankRefNo: responseData.bank_ref_no,
          currency: responseData.currency,
          amount: responseData.amount,
          message: responseData.status_message,
          transDate: responseData.trans_date,
        };

        const queryParams = new URLSearchParams(responseData).toString();

        // Redirect with query parameters
        const redirectUrl = `${process.env.FRONTEND_REDIRECT_URL}/booking-confirmation?${queryParams}`;

        res.redirect(redirectUrl);
      } catch (error) {
        console.error("Failed to create order:", error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to create order." });
        }
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Unexpected error occurred." });
    }
  }
};

module.exports = { createCCAvenueOrder, ccAvenueResponseHandler };
