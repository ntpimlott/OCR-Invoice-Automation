const invoiceModel = require("../models/invoiceModel");
const { createCSVFileName } = require("../utils/createFileName");
const { createCSV } = require("../utils/csvExporter");
const { createInvoiceHash } = require('../utils/createHash');
const { compareVendorNames } = require("../utils/compareVendorNames");

//Controller for creating invoice
exports.createInvoice = (req, res) => {
  const { vendor, total, date } = req.body;

  if (!total || isNaN(Number(total))) {
    return res.status(400).json({ error: "Amount must be a number" });
  }

  if (!vendor || !total || !date) {
    console.error("Missing Request");
    return res.status(400).json({
      success: false,
      error: "Bad request: missing required field",
    });
  }

  //Fuzz Matching
  const vendorNormalized = compareVendorNames(vendor);

  //Create Hash
  const hash = createInvoiceHash(date, vendorNormalized, total);

  //Check for duplicates
  if(invoiceModel.checkDuplicateInvoice(hash)){
    console.error("Duplicate Invoice");
    return res.status(400).json({
      success: false,
      error: "Hash already exists"
    });
  }
  invoiceModel.createInvoice(date, vendorNormalized, total, null, hash);
  res.send("invoice Created");
};

//CSV Export
exports.exportCSV = (req, res) => {
  const invoices = invoiceModel.readInvoices();

  if (!invoices.length) {
    return res.status(200).send("No Invoices Available");
  }

  const csvHeaders = ["date", "vendor", "amount", "status"];

  const csv = createCSV(csvHeaders, invoices);

  const fileName = createCSVFileName();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  res.status(200).send(csv);
};

//Get all invoices for Frontend List
exports.getInvoices = (req, res) => {
  const invoices = invoiceModel.readInvoices();

  res.status(200).send(invoices);
}