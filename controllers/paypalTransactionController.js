const Reservation = require("../Models/Reservation");
const Transaction = require("../Models/transaction");

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;
// need to change the PAYPAL_BASE_URL when it is to be live. The given one is for tesing

const payPalCreateOrder = async (req, res) => {
  const { cart } = req.body;

  const reservationDetails = new Reservation({
    name: cart.name,
    email: cart.email,
    phone: cart.phone,
    no_of_people: cart.no_of_people,
    check_in: cart.check_in,
    chech_out: cart.check_out,
    user_id: cart.user_id,
    hotel_id: cart.hotel_id,
    price: cart.amount,
    status: "pending",
  });

  const newReservation = await reservationDetails.save();

  const newTransaction = new Transaction({
    reservationId: newReservation._id,
    userId: cart.user_id,
    amount: cart.amount,
    currency: "USD",
    paymentMethod: "PayPal",
    paymentStatus: "Pending",
  });

  const savedTransaction = await newTransaction.save();

  try {
    const { jsonResponse, httpStatusCode } = await createOrder(cart);

    if (httpStatusCode !== 201) {
      throw new Error("Failed to create order.");
    }

    savedTransaction.transactionId = jsonResponse.id;
    await savedTransaction.save();

    res.status(httpStatusCode).json(jsonResponse);
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

const createOrder = async (cart) => {
  try {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_BASE_URL}/v2/checkout/orders`;

    const paymentDetails = {
      currency: "USD",
      amount: cart.amount,
      paymentMethod: "PayPal",
    };

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: paymentDetails.currency,
            value: paymentDetails.amount,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to create order:", error);
  }
};

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

const captureOrder = async (req, res) => {
  const orderID = req.params.id;
  const { jsonResponse, httpStatusCode } = await captureOrderHelper(orderID);

  const transaction = await Transaction.findOne({ transactionId: orderID });
  const reservation = await Reservation.findOne({
    _id: transaction.reservationId,
  });

  try {
    if (jsonResponse.status === "COMPLETED") {
      transaction.paymentStatus = "Completed";
      reservation.status = "confirmed";
      reservation.is_payment_done = true;
    } else {
      transaction.paymentStatus = "Failed";
      reservation.status = "cancelled";
    }

    await transaction.save();
    await reservation.save();

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);

    // delete transaction and reservation if order creation fails
    if (transaction) {
      transaction.paymentStatus = "Failed";
      await transaction.save();
    }
    if (reservation) {
      reservation.status = "cancelled";
      await reservation.save;
    }

    res.status(500).json({ error: "Failed to capture order." });
  }
};

const captureOrderHelper = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

module.exports = { payPalCreateOrder, captureOrder };
