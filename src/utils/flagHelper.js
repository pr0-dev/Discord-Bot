"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

const flagMap = {
    1: "SFW",
    2: "NSFW",
    4: "NSFL",
    8: "NSFP",
    16: "POL",
};
const ALL_FLAGS = Object.keys(flagMap).map(Number).reduce((a, b) => a + b, 0);

/**
 * @param {number} flag
 * @returns {string}
 */
const getFlagRepresentation = function(flag){
    return flagMap[flag] || "Unbekannt";
};

module.exports = {
    ALL_FLAGS,
    getFlagRepresentation,
};
