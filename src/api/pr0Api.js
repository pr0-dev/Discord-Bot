"use strict";

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
 * @param {*} method
 * @param {*} endpoint
 * @param {*} params
 * @param {*} headers
 * @param {*} callback
 */
let performRequest = function(method, endpoint, params = {}, headers = {}, formData = {}, callback){
    let req = unirest(method, endpoint);

    let cookieFile;
    if (fs.existsSync(cookiePath)) cookieFile = fs.readFileSync(cookiePath);

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
 * Get pr0gramm lofin status
 *
 * @param {*} callback
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

// POST Requests

/**
 * login to pr0gramm.com
 *
 * @param {*} user
 * @param {*} pass
 * @param {*} callback
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
    getLoginStatus,
    postLogin
};
