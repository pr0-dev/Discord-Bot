"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

// Core Modukes
let path = require("path");

// Dependencies
let moment = require("moment");

// API
let api = require("./pr0Api");

// Utils
let log = require("../utils/logger");
let config = require("../utils/configHandler").getConfig();

const regexes = {
    directsRegex: /http(?:s?):\/\/(?:vid|img)\.pr0gramm\.com\/([0-9]{1,4})\/([0-9]{1,2})\/([0-9]{1,2})\/(\w+)\.(\w+)/gi,
    uploadsRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new|user\/\w+\/(?:uploads|likes)|stalk)(?:(?:\/[\w\(\)\-\%\!\.\_\[\]\@\:\$\#\&\'\:\?\*\+\,\;\=\~]+)?)\/(\d+)/gi,
    commentRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new|user\/\w+\/(?:uploads|likes)|stalk)(?:(?:\/[\w\(\)\-\%\!\.\_\[\]\@\:\$\#\&\'\:\?\*\+\,\;\=\~]+)?)\/(\d+)(?:(?::)comment(\d+))/gi,
    userInfRegex: /http(?:s?):\/\/pr0gramm\.com\/user\/(\w+)/gi
};

moment.locale("de");

/**
 * Pr0gramm Orange
 * Hex: 0xEE4d2E
 * Dec: 15617326
 *
 * DiscordJS: Range = 0 - 16777215 (0xFFFFFF)
 */
const orange = 15617326;

const imgUri = "https://img.pr0gramm.com/";

const getRank = function(id){
    switch (id){
        case 0:  return "Schwuchtel";
        case 1:  return "Neuschwuchtel";
        case 2:  return "Altschwuchtel";
        case 3:  return "Admin";
        case 4:  return "Gesperrt";
        case 5:  return "Moderator";
        case 6:  return "Fliesentischbesitzer";
        case 7:  return "Lebende Legende";
        case 8:  return "Wichtler";
        case 9:  return "Edler Spender";
        case 10: return "Mittelaltschwuchtel";
        case 11: return "Alt-Moderator";
        case 12: return "Community-Helfer";
        case 13: return "Nutzer-Bot";
        case 14: return "System-Bot";
        case 15: return "Alt-Helfer";
        case 16: return "Blauschwuchtel";
        case 17: return "Rotschwuchtel";
    }
};

/**
 * Creates the Post embed based on fetched data
 *
 * @param {import("discord.js").Message & { channel: import("discord.js").GuildChannel }} message
 * @param {Object} post
 * @returns embed
 */
const uploadEmbed = function(message, post){
    let tag = "";

    if (post.flags === 1) tag = "SFW";
    else if (post.flags === 2) tag = "NSFW";
    else if (post.flags === 4) tag = "NSFL";
    else if (post.flags === 8) tag = "NSFP";

    let preview = imgUri + post.image;

    if (tag === "NSFL" && config.bot_settings.disable_nsfl_preview){
        preview = path.resolve("./src/res/nsfl.png");
    }

    if (tag === "NSFW" && !message.channel.nsfw && config.bot_settings.nsfw_in_nswfchat_only){
        preview = path.resolve("./src/res/nsfw.png");
    }

    let embed = {
        embed: {
            color: orange,
            title: "Link zum Hochlad",
            url: message.content,
            fields: [
                {
                    name: "Benis",
                    value: String(post.up - post.down),
                    inline: true
                },
                {
                    name: "Up",
                    value: String(post.up),
                    inline: true
                },
                {
                    name: "Down",
                    value: String(post.down),
                    inline: true
                },
                {
                    name: "Hochgeladen",
                    value: String(moment.unix(post.timestamp).fromNow()),
                    inline: true
                },
                {
                    name: "Von",
                    value: `[${post.user}](http://pr0gramm.com/user/${post.user})`,
                    inline: true
                },
                {
                    name: "Tag",
                    value: String(tag),
                    inline: true
                }
            ]
        },
        files: [
            preview
        ]
    };

    return embed;
};

/**
 * Creates the comment embed based on fetched data
 *
 * @param {import("discord.js").Message} message
 * @param {Object} data
 * @returns embed
 */
const commentEmbed = function(message, data){
    let embed = {
        embed: {
            color: orange,
            title: "Link zum Comment",
            url: message.content,
            fields: [
                {
                    name: "Kommentar",
                    value: String(data.content)
                },
                {
                    name: "Benis",
                    value: String(data.up - data.down),
                    inline: true
                },
                {
                    name: "Up",
                    value: String(data.up),
                    inline: true
                },
                {
                    name: "Down",
                    value: String(data.down),
                    inline: true
                },
                {
                    name: "Kommentiert",
                    value: String(moment.unix(data.timestamp).fromNow()),
                    inline: true
                },
                {
                    name: "Von",
                    value: `[${data.name}](http://pr0gramm.com/user/${data.name})`,
                    inline: true
                },
                {
                    name: "Auf",
                    value: "[pr0gramm.com](http://pr0gramm.com)",
                    inline: true
                }
            ]
        }
    };

    return embed;
};

/**
 * Creates the user embed based on fetched data
 *
 * @param {import("discord.js").Message} message
 * @param {Object} data
 * @returns
 */
const userEmbed = function(message, data){
    let embed = {
        embed: {
            color: orange,
            title: data.user.name,
            url: message.content,
            fields: [
                {
                    name: "Benis",
                    value: String(data.user.score),
                    inline: true
                },
                {
                    name: "Rang",
                    value: getRank(data.user.mark),
                    inline: true
                },
                {
                    name: "Registriert",
                    value: String(moment.unix(data.user.registered).fromNow()),
                    inline: true
                },
                {
                    name: "Uploads",
                    value: String(data.uploadCount),
                    inline: true
                },
                {
                    name: "Kommentare",
                    value: String(data.commentCount),
                    inline: true
                },
                {
                    name: "Tags",
                    value: String(data.tagCount),
                    inline: true
                }
            ]
        }
    };

    return embed;
};

/**
 * Create a Discord Embed
 *
 * @param {import("discord.js").Message & { channel: import("discord.js").GuildChannel}} message
 * @param {Function} callback
 * @returns
 */
const createEmbed = function(message, callback){
    if (config.bot_settings.embed_direct_links && (message.content).match(regexes.directsRegex)){
        let query = (message.content).replace(/http(?:s?):\/\/(?:vid|img)\.pr0gramm\.com\//gi, "");

        api.reverseSearch(query, (err, res) => {
            if (err) return log.error(err);

            let resData = res.body;
            if (resData.error) return log.error(resData.error);

            if (!resData.items[0]) return null;

            let up        = resData.items[0].up;
            let down      = resData.items[0].down;
            let image     = resData.items[0].image;
            let flags     = resData.items[0].flags;
            let user      = resData.items[0].user;
            let timestamp = resData.items[0].created;

            let postLayout = uploadEmbed(message, {
                up: up,
                down: down,
                image: image,
                flags: flags,
                user: user,
                timestamp: timestamp
            });

            return callback(null, postLayout);
        });
    }

    else if ((message.content).match(regexes.commentRegex)){
        let match = (regexes.commentRegex).exec(message.content);

        // Access Regex Groups
        let postId = match?.[1];
        let commentId = match?.[2];

        if (!postId) return null;

        api.getPostMeta(postId, (err, res) => {
            if (err) return log.error(err);

            let resData = res.body;
            if (resData.error) return log.error(resData.error);

            let comments = resData.comments;

            for (let comment of comments){
                if (Number(comment.id) === Number(commentId)){
                    let content   = comment.content;
                    let up        = comment.up;
                    let down      = comment.down;
                    let name      = comment.name;
                    let timestamp = comment.created;

                    let embedLayout = commentEmbed(message, {
                        content: content,
                        up: up,
                        down: down,
                        name: name,
                        timestamp: timestamp
                    });

                    callback(null, embedLayout);
                }
            }
        });
    }

    else if ((message.content).match(regexes.uploadsRegex)){
        let match = (regexes.uploadsRegex).exec(message.content);
        let postId = match?.[1];

        if (!postId) return null;

        api.getPost(postId, (err, res) => {
            if (err) return log.error(err);

            let resData = res.body;
            if (resData.error) return log.error(resData.error);

            let up        = resData.items[0].up;
            let down      = resData.items[0].down;
            let image     = resData.items[0].image;
            let flags     = resData.items[0].flags;
            let user      = resData.items[0].user;
            let timestamp = resData.items[0].created;

            let postLayout = uploadEmbed(message, {
                up: up,
                down: down,
                image: image,
                flags: flags,
                user: user,
                timestamp: timestamp
            });

            callback(null, postLayout);
        });
    }

    else if ((message.content).match(regexes.userInfRegex)){
        let match = (regexes.userInfRegex).exec(message.content);
        let username = match?.[1];

        if (!username) return null;

        api.getUser(username, (err, res) => {
            if (err) return log.error(err);

            let resData = res.body;
            if (resData.error) return log.error(resData.error);

            let userLayout = userEmbed(message, resData);

            callback(null, userLayout);
        });
    }

    else return callback("Kein Regex hat gematched");
};

module.exports = {
    createEmbed
};
