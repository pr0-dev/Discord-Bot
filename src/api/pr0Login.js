"use strict";

// Core Modules
let fs = require("fs");
let path = require("path");

// Utils
let log = require("../utils/logger");

// API
let api = require("./pr0Api");

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
