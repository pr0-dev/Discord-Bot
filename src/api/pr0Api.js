"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Core Modules
const fs = require("fs");
const path = require("path");

// Dependencies
const unirest = require("unirest");

// Utils
const log = require("../utils/logger");
const config = require("../utils/configHandler").getConfig();

// Helper Functions

const cookiePath = path.join("cookie.txt");

/**
 * Performs the actual request
 *
 * @param {string} method
 * @param {string} endpoint
 * @param {object} params
 * @param {object} headers
 * @param {object} formData
 * @param {Function} callback
 * @returns {any} callback
 */
const performRequest = function(method, endpoint, params = {}, headers = {}, formData = {}, callback){
    const req = unirest(method, endpoint);

    let cookieFile;
    if (fs.existsSync(cookiePath)) cookieFile = fs.readFileSync(cookiePath);

    /* eslint-disable dot-notation */

    params["flags"] = "15";

    headers["cache-control"] = "no-cache";
    headers["cookie"] = String(cookieFile);
    headers["user-agent"] = config.pr0api.user_agent || `${config.pr0api.username}/1.1 (${process.platform}; ${process.arch}) NodeJS/${process.version.substring(1)}`;

    req.query(params);
    req.headers(headers);
    req.form(formData);

    req.end((res) => {
        if (res.error) return callback(res.error);
        return callback(null, res);
    });
};

// GET Requests

/**
 * Get pr0gramm login status
 *
 * @param {Function} callback
 * @returns {any} callback
 */
const getLoginStatus = function(callback){
    performRequest("GET", "https://pr0gramm.com/api/user/loggedin", {}, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

/**
 * Perform a reverse search of direct link
 *
 * @param {string} search
 * @param {Function} callback
 * @returns {any} callback
 */
const reverseSearch = function(search, callback){
    const query = {
        tags: "!p:" + search,
    };

    performRequest("GET", "https://pr0gramm.com/api/items/get", query, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

/**
 * Get post
 *
 * @param {string} postId
 * @param {Function} callback
 * @returns {any} callback
 */
const getPost = function(postId, callback){
    const query = {
        id: postId,
    };

    performRequest("GET", "https://pr0gramm.com/api/items/get", query, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

/**
 * Get post meta
 *
 * @param {string} postId
 * @param {Function} callback
 * @returns {any} callback
 */
const getPostMeta = function(postId, callback){
    const query = {
        itemId: postId,
    };

    performRequest("GET", "https://pr0gramm.com/api/items/info", query, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

/**
 * Get user
 *
 * @param {string} username
 * @param {Function} callback
 * @returns {any} callback
 */
const getUser = function(username, callback){
    const query = {
        name: username,
    };

    performRequest("GET", "https://pr0gramm.com/api/profile/info", query, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

const getCaptcha = function(callback){
    performRequest("GET", `https://pr0gramm.com/api/user/captcha?bust=${Math.random()}`, {}, {}, {}, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

// POST Requests

/**
 * login to pr0gramm.com
 *
 * @param {Object} data
 * @param {Function} callback
 * @returns {any} callback
 */
const postLogin = function(data, callback){
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const formData = {
        name: data.user,
        password: data.pass,
    };

    if (!!data.token) formData.token = data.token;
    if (!!data.captchaSolution) formData.captcha = data.captchaSolution;

    performRequest("POST", "https://pr0gramm.com/api/user/login", {}, headers, formData, (err, res) => {
        if (err){
            log.error(err);
            return callback(err);
        }
        return callback(null, res);
    });
};

module.exports = {
    // GEGT
    getLoginStatus,
    reverseSearch,
    getPost,
    getPostMeta,
    getUser,
    getCaptcha,
    // POST
    postLogin,
};
