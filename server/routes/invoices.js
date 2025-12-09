var express = require('express');
var router = express.Router();

const invoiceController = require("../controllers/invoiceController");

//GET CSV Export "/api/csv-export"
router.get('/csv-export', invoiceController.exportCSV);

//GET Invoices "/api/invoices"
router.get('/invoices', invoiceController.getInvoices);

//POST Stores Invoice Data "/api/invoices"
router.post('/invoices', invoiceController.createInvoice);

module.exports = router;
