"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

// Core Modules
const fs = require("fs");
const path = require("path");

// Dependencies
const termImg = require("terminal-image");

// Utils
const log = require("../utils/logger");
const config = require("../utils/configHandler").getConfig();

// API
const api = require("./pr0Api");

/**
 * Login and stored created cookie
 *
 * @param {string} user
 * @param {string} pass
 */
const performLogin = function(user, pass, cb){
    if (!config.pr0api.userbot){
        api.getCaptcha(async(err, res) => {
            if (err){
                log.error("Konnte captcha nicht abfragen: " + err);
                return process.exit(1);
            }

            const { captcha } = res.body;
            const { token } = res.body;

            const buffer = Buffer.from(captcha.replace(/^data:image\/png;base64,/, ""), "base64");
            console.log(
                "\n" +
                await termImg.buffer(buffer, { width: 70, height: 50, preserveAspectRatio: true })
            );

            const captchaSolution = await new Promise(resolve => {
                process.stdout.write(" Captcha lösung eingeben: ");
                process.stdin.resume();
                process.stdin.setEncoding("utf8");
                process.stdin.on("data", input => resolve(String(input).trim()));
            });

            console.log("");

            api.postLogin({ user, pass, captchaSolution, token }, (logerr, logres) => {
                if (logerr || !logres.body.success){
                    log.error("pr0gramm Logindaten oder Captcha inkorrekt");
                    return process.exit(1);
                }

                log.done("pr0gramm login erfolgreich");
                fs.writeFileSync(path.resolve("cookie.txt"), logres.headers["set-cookie"].join());
                return cb();
            });
        });
    }

    else {
        api.postLogin({ user, pass }, (err, res) => {
            if (err || !res.body.success){
                log.error("pr0gramm Logindaten inkorrekt");
                return process.exit(1);
            }

            log.done("pr0gramm login erfolgreich");
            fs.writeFileSync(path.resolve("cookie.txt"), res.headers["set-cookie"].join());
            return cb();
        });
    }
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
