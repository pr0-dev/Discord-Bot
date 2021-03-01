"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

// Core Modules
let fs = require("fs");
let path = require("path");

// Utils
let log = require("../utils/logger");

// API
let api = require("./pr0Api");

/**
 * Login and stored created cookie
 *
 * @param {string} user
 * @param {string} pass
 */
let performLogin = function(user, pass){
    api.postLogin(user, pass, (err, res) => {
        if (err || !res.body.success){
            log.error("pr0gramm Logindaten inkorrekt");
            return process.exit(1);
        }

        log.done("pr0gramm login erfolgreich");
        fs.writeFileSync(path.resolve("cookie.txt"), res.headers["set-cookie"][1]);
    });
};

/**
 * Check if the old cookie is still valid
 *
 * @param {Function} callback
 */
let validSession = function(callback){
    api.getLoginStatus((err, res) => {
        if (err) return;
        if (res.body.loggedIn) return callback(true);
        return callback(false);
    });
};

module.exports = {
    performLogin,
    validSession
};
