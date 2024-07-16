const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
