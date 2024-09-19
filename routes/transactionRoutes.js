const express = require('express');
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { payPalCreateOrder, captureOrder } = require('../controllers/paypalTransactionController');
const { createCCAvenueOrder, ccAvenueResponseHandler } = require('../controllers/ccAvenueTransactionController');

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.post('/orders', payPalCreateOrder)
router.post('/orders/:id/capture', captureOrder);
router.post('/orders/ccavenue', createCCAvenueOrder);
router.post('/ccavenue/response', ccAvenueResponseHandler);

module.exports = router;
