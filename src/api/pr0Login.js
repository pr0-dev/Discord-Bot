// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

import fs from "node:fs";
import path from "node:path";
import unirest from "unirest";
import * as termImg from "terminal-image";
import log from "../utils/logger.js";
import { config } from "../../config.base.js";
import api from "./pr0Api.js";

/**
 * Check if the user is a bot
 *
 * @returns {Promise<Boolean>}
 */
const isUserBot = function(){
    const req = unirest("GET", `https://pr0gramm.com/api/profile/info?name=${config.pr0api.username}&flags=1`);
    req.headers({
        "cache-control": "no-cache",
        "user-agent": config.pr0api.user_agent || `${config.pr0api.username}/1.1 (${process.platform}; ${process.arch}) NodeJS/${process.version.substring(1)}`,
    });
    return new Promise(resolve => req.end((res) => {
        if (res.error) return resolve(false);
        return resolve(res.body.user.mark === 13);
    }));
};

/**
 * Login and stored created cookie
 *
 * @param {string} user
 * @param {string} pass
 */
const performLogin = async function(user, pass, cb){
    const userBot = await isUserBot();
    log.info("User-Bot: " + userBot);
    if (!userBot){
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
                await termImg.buffer(buffer, { width: 70, height: 50, preserveAspectRatio: true }),
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

export default {
    performLogin,
    validSession,
};
