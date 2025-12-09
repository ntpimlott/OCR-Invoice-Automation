const stringSimilarity = require("string-similarity");

const vendorList = {
  rona: "RONA",
  home_depot: "Home Depot",
  lowes: "Lowes",
  home_hardware: "Home Hardware",
};

const normalizedVendorList = ["rona", "home depot", "lowes", "home hardware"];

exports.compareVendorNames = (inputString) => {
  //Remove non alphanumeric, replace 0 to o, remove whitespace
  const processedString = inputString
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/0/g, "o")
    .trim()
    .replace(/\s+/g, " ");

  //Get results of similarity
  const result = stringSimilarity.findBestMatch(
    processedString,
    normalizedVendorList
  );

  //0.7 is an approximate estimate where it should catch a lot of similar words
  if (result.bestMatch.rating > 0.7) {
    return vendorList[result.bestMatch.target.replace(/\s+/g, "_")];
  } else {
    return inputString;
  }
};
