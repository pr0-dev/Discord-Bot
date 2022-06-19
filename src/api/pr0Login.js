"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

// Core Modules
const fs = require("fs");
const path = require("path");

// Utils
const log = require("../utils/logger");

// API
const api = require("./pr0Api");

/**
 * Login and stored created cookie
 *
 * @param {string} user
 * @param {string} pass
 */
const performLogin = function(user, pass){
    api.postLogin(user, pass, (err, res) => {
        if (err || !res.body.success){
            log.error("pr0gramm Logindaten inkorrekt");
            return process.exit(1);
        }

        log.done("pr0gramm login erfolgreich");
        fs.writeFileSync(path.resolve("cookie.txt"), res.headers["set-cookie"].join());
    });
};

/**
 * Check if the old cookie is still valid
 *
 * @param {Function} callback
 */
const validSession = function(callback){
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
