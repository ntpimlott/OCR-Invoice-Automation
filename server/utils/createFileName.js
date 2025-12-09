exports.createCSVFileName = () => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[:]/g, "-")
    .replace(/\..+/, "")
    .replace("T", "_");

  return `invoices-${timestamp}.csv`;
};
