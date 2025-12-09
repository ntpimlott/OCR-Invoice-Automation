exports.createCSV = (headers, data) => {
  let displayHeaders = headers.map(
    (header) => header.charAt(0).toUpperCase() + header.slice(1)
  );

  if (!data.length === 0 || !Array.isArray(data)) {
    return displayHeaders.join(",") + "\n";
  }

  let csv = displayHeaders.join(",") + "\n";

  data.map((value) => {
    const row = headers.map((header) => value[header]);
    csv += row.join(",") + "\n";
  });

  return csv;
};
