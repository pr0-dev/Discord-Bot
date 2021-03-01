"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

// Core Modules
let fs = require("fs");
let path = require("path");

// Dependencies
let unirest = require("unirest");

// Utils
let log = require("../utils/logger");

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
let performRequest = function(method, endpoint, params = {}, headers = {}, formData = {}, callback){
    let req = unirest(method, endpoint);

    let cookieFile;
    if (fs.existsSync(cookiePath)) cookieFile = fs.readFileSync(cookiePath);

    /* eslint-disable dot-notation */

    params["flags"] = "15";

    headers["cache-control"] = "no-cache";
    headers["cookie"] = cookieFile;

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
let getLoginStatus = function(callback){
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
let reverseSearch = function(search, callback){
    let query = {
        tags: "!p:" + search
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
let getPost = function(postId, callback){
    let query = {
        "id": postId
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
let getPostMeta = function(postId, callback){
    let query = {
        "itemId": postId
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
let getUser = function(username, callback){
    let query = {
        "name": username
    };

    performRequest("GET", "https://pr0gramm.com/api/profile/info", query, {}, {}, (err, res) => {
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
 * @param {string} user
 * @param {string} pass
 * @param {Function} callback
 * @returns {any} callback
 */
let postLogin = function(user, pass, callback){
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    let formData = {
        "name": user,
        "password": pass
    };

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
    // POST
    postLogin
};
