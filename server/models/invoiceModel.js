const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../db.json");

exports.readInvoices = () => {
  try {
    const rawInvoices = fs.readFileSync(filePath, "utf-8");
    const jsonInvoices = JSON.parse(rawInvoices);
    return jsonInvoices;
  } catch (error) {
    console.error("Error reading db file: ", error);
  }
};

exports.createInvoice = (date, vendor, amount, status, hash) => {
  try {
    let invoices = this.readInvoices();

    //If not provided should default to Unpaid
    invoices.push({
      date: date,
      vendor: vendor,
      amount: amount,
      status: status || "Unpaid",
      hash: hash,
    });
    fs.writeFileSync(filePath, JSON.stringify(invoices, null));
  } catch (error) {
    console.error("Failed to write to db.json: ", error);
  }
};

exports.checkDuplicateInvoice = (hash) => {
  const invoices = this.readInvoices();

  const hashExists = invoices.some((invoice) => invoice.hash === hash);

  return hashExists;
};
