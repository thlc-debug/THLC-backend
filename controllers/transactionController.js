const Transaction = require('../Models/transaction');

const createTransaction = async (req, res) => {
  try {
    const { reservationId, userId, amount, currency, paymentMethod, paymentStatus } = req.body;
    const transaction = new Transaction({ reservationId, userId, amount, currency, paymentMethod, paymentStatus });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reservationId, userId, amount, currency, paymentMethod, paymentStatus } = req.body;
    const transaction = await Transaction.findById(id);
    if (transaction) {
      transaction.reservationId = reservationId;
      transaction.userId = userId;
      transaction.amount = amount;
      transaction.currency = currency;
      transaction.paymentMethod = paymentMethod;
      transaction.paymentStatus = paymentStatus;
      transaction.updatedAt = Date.now();
      await transaction.save();
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (transaction) {
      await transaction.remove();
      res.status(200).json({ message: 'Transaction deleted' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
