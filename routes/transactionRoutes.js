const express = require('express');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { payPalCreateOrder, captureOrder } = require('../controllers/paypalTransactionController');

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.post('/orders', payPalCreateOrder)
router.post('/orders/:id/capture', captureOrder);

module.exports = router;
