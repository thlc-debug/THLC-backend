const crypto = require("crypto");
const ccav = require("../utils/ccavenueUtils");
const qs = require("querystring");
const Reservation = require("../Models/Reservation");
const Transaction = require("../Models/transaction");

const createCCAvenueOrder = async (req, res) => {
  try {
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
    console.log("Request body:", req.body); // Debug log
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

    let body = "",
      workingKey = process.env.CC_WORKING_KEY,
      accessCode = process.env.CC_ACCESS_CODE,
      encRequest = "",
      formbody = "";

    let md5 = crypto.createHash("md5").update(workingKey).digest();
    let keyBase64 = Buffer.from(md5).toString("base64");

    let ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    const data = {
      merchant_id: process.env.CC_MERCHANT_ID,
      order_id: savedTransaction._id,
      currency: currency,
      amount: price.toFixed(2),
      redirect_url: process.env.CC_REDIRECT_URI,
      cancel_url: process.env.CC_CANCEL_URI,
      language: "EN",
      billing_name: name,
      billing_tel: phone,
      billing_email: email,
    };

    body = Object.keys(data)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
      )
      .join("&");

    encRequest = ccav.encrypt(body, keyBase64, ivBase64);

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
    res.status(500).json({ error: "Failed to create order." });
  }
};

const ccAvenueResponseHandler = async (req, res) => {
  try {
    let ccavEncResponse = "",
      ccavResponse = "",
      workingKey = process.env.CC_MERCHANT_ID,
      ccavPOST = "";

    let md5 = crypto.createHash("md5").update(workingKey).digest();
    let keyBase64 = Buffer.from(md5).toString("base64");

    let ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");

    req.on("data", async (data) => {
      ccavEncResponse += data;
      ccavPOST = qs.parse(ccavEncResponse);
      let encryption = ccavPOST.encResp;
      ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
    });

    req.on("end", async () => {
      const responseData = ccavResponse.split("&").reduce((acc, pair) => {
        const [key, value] = pair.split("=");
        acc[key] = decodeURIComponent(value);
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
      }

      res.status(200).data({
        orderId: responseData.order_id,
        transactionId: responseData.tracking_id,
        paymentMethod: responseData.payment_mode,
        bankRefNo: responseData.bank_ref_no,
        currency: responseData.currency,
        amount: responseData.amount,
        message: responseData.status_message,
        transDate: responseData.trans_date,
      });
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

module.exports = { createCCAvenueOrder, ccAvenueResponseHandler };
