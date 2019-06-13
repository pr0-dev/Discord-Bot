"use strict";

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
    uploadsRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new|user\/\w+\/(?:uploads|likes)|stalk)(?:(?:\/\w+)?)\/(\d+)/gi,
    commentRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new|user\/\w+\/(?:uploads|likes)|stalk)(?:(?:\/\w+)?)\/(\d+)(?:(?::)comment(\d+))/gi,
    userInfRegex: /http(?:s?):\/\/pr0gramm\.com\/user\/(\w+)/gi
};

moment.locale("de");

/**
 * Pr0gramm Orange
 * Hex: 0xEE4d2E
 * Dec: 15617326
 */
const orange = "15617326";

const imgUri = "https://img.pr0gramm.com/";

/**
 * Creates the Post embed based on fetched data
 *
 * @param {*} message
 * @param {*} post
 * @returns embed
 */
let uploadEmbed = function(message, post){
    /**
     * Filters:
     *
     * 1:  SFW  - Safe For Work
     * 2:  NSFW - Not Safe For Work
     * 4:  NSFL - Not Safe For Life
     * 8:  NSFP - Not Safe For Public (SFW)
     */
    let tag = "";

    if (post.flags === 1) tag = "SFW";
    if (post.flags === 2) tag = "NSFW";
    if (post.flags === 4) tag = "NSFL";
    if (post.flags === 8) tag = "NSFP";

    let preview = imgUri + post.image;

    // @ts-ignore
    if (tag === "NSFL" && config.bot_settings.disable_nsfl_preview){
        preview = path.join(".", "src", "res", "nsfl.png");
    }

    // @ts-ignore
    if (tag === "NSFW" && !message.channel.nsfw && config.bot_settings.nsfw_in_nswfchat_only){
        preview = path.join(".", "src", "res", "nsfw.png");
    }

    let embed = {
        embed: {
            color: orange,
            title: "Link zum Hochlad",
            url: message.content,
            fields: [
                {
                    name: "Benis",
                    value: post.up - post.down,
                    inline: true
                },
                {
                    name: "Up",
                    value: post.up,
                    inline: true
                },
                {
                    name: "Down",
                    value: post.down,
                    inline: true
                },
                {
                    name: "Hochgeladen",
                    value: moment.unix(post.timestamp).fromNow(),
                    inline: true
                },
                {
                    name: "Von",
                    value: `[${post.user}](http://pr0gramm.com/user/${post.user})`,
                    inline: true
                },
                {
                    name: "Tag",
                    value: tag,
                    inline: true
                }
            ]
            /*
            footer: {
                color: "00000",
                text: "auf pr0gramm.com"
            }
            */
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
 * @param {*} message
 * @param {*} data
 * @returns embed
 */
let commentEmbed = function(message, data){
    let embed = {
        embed: {
            color: orange,
            title: "Link zum Comment",
            url: message.content,
            fields: [
                {
                    name: "Kommentar",
                    value: data.content
                },
                {
                    name: "Benis",
                    value: data.up - data.down,
                    inline: true
                },
                {
                    name: "Up",
                    value: data.up,
                    inline: true
                },
                {
                    name: "Down",
                    value: data.down,
                    inline: true
                },
                {
                    name: "Kommentiert",
                    value: moment.unix(data.timestamp).fromNow(),
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
 * @param {*} message
 * @param {*} data
 * @returns
 */
let userEmbed = function(message, data){
    /**
     * Ränge:
     *
     * 0:  Schwuchtel
     * 1:  Neuschwuchtel
     * 2:  Altschwuchtel
     * 3:  Admin
     * 4:  Gesperrt
     * 5:  Moderator
     * 6:  Fliesentischbesitzer
     * 7:  Lebende Legende
     * 8:  Wichtler
     * 9:  Edler Spender
     * 10: Mittelaltschwuchtel
     * 11: Alt-Moderator
     * 12: Community-Helfer
     * 13: Nutzer-Bot
     * 14: System-Bot
     */
    let rang = "";

    if (data.user.mark === 0)  rang = "Schwuchtel";
    if (data.user.mark === 1)  rang = "Neuschwuchtel";
    if (data.user.mark === 2)  rang = "Altschwuchtel";
    if (data.user.mark === 3)  rang = "Admin";
    if (data.user.mark === 4)  rang = "Gesperrt";
    if (data.user.mark === 5)  rang = "Moderator";
    if (data.user.mark === 6)  rang = "Fliesentischbesitzer";
    if (data.user.mark === 7)  rang = "Lebende Legende";
    if (data.user.mark === 8)  rang = "Wichtler";
    if (data.user.mark === 9)  rang = "Edler Spender";
    if (data.user.mark === 10) rang = "Mittelaltschwuchtel";
    if (data.user.mark === 11) rang = "Alt-Moderator";
    if (data.user.mark === 12) rang = "Community-Helfer";
    if (data.user.mark === 13) rang = "Nutzer-Bot";
    if (data.user.mark === 14) rang = "System-Bot";

    let embed = {
        embed: {
            color: orange,
            title: data.user.name,
            url: message.content,
            fields: [
                {
                    name: "Benis",
                    value: data.user.score,
                    inline: true
                },
                {
                    name: "Rang",
                    value: rang,
                    inline: true
                },
                {
                    name: "Registriert",
                    value: moment.unix(data.user.registered).fromNow(),
                    inline: true
                },
                {
                    name: "Uploads",
                    value: data.uploadCount,
                    inline: true
                },
                {
                    name: "Kommentare",
                    value: data.commentCount,
                    inline: true
                },
                {
                    name: "Tags",
                    value: data.tagCount,
                    inline: true
                }
            ]
        }
    };

    return embed;
};

let createEmbed = function(message, callback){
    if ((message.content).match(regexes.commentRegex)){
        let match = (regexes.commentRegex).exec(message.content);

        // Access Regex Groups
        let postId = match[1];
        let commentId = match[2];

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
        let postId = match[1];

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
        let username = match[1];

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
