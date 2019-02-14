"use strict";

// Dependencies
let request = require("request");
let moment = require("moment");

// API
let api = require("./pr0Api");

// Utils
let log = require("../utils/logger");

const regexes = {
    uploadsRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new)(?:(?:\/.+)?)\/(\d+)/gi,
    commentRegex: /http(?:s?):\/\/pr0gramm\.com\/(?:top|new)(?:(?:\/.+)?)\/(\d+)(?::)comment(\d+)/gi,
    userInfRegex: /http(?:s?):\/\/pr0gramm\.com\/user\/(\w+)/gi
};

moment.locale("de");

/**
 * Pr0gramm Orange
 * Hex: 0xEE4d2E
 * Dec: 15617326
 */
const orange = "15617326";

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
    }
    
    else if ((message.content).match(regexes.userInfRegex)){
        let match = (regexes.userInfRegex).exec(message.content);
        let username = match[1];
    }

    else return callback(true);
};

module.exports = {
    createEmbed
};
