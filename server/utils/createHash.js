const crypto = require("crypto");

exports.createInvoiceHash = (date, vendor, total) => {
  const combinedString = `${date}|${vendor}|${total}`;
  const hash = crypto.createHash("sha256");
  hash.update(combinedString);
  const hashResult = hash.digest("hex");
  return hashResult;
};
