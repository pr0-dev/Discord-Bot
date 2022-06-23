"use strict";

// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

// Dependencies
const { Client, Intents } = require("discord.js");

// API
const embedHandler = require("./api/embedHandler");
const login = require("./api/pr0Login");

// Utils
const conf = require("./utils/configHandler");
const log = require("./utils/logger");

const intents = new Intents(33281); // @ts-ignore
const client = new Client({ intents });

const appname = conf.getName();
const version = conf.getVersion();

console.log(
    "\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n" +
    " # " + appname + " v" + version + " gestartet #\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n"
);

log.info(`Starte ${appname}...`);
const config = conf.getConfig();

process.on("unhandledRejection", (err, promise) => {
    log.error("Unhandled rejection (promise: " + JSON.stringify(promise) + ", reason: " + err + ")");
});

client.on("ready", () => {
    log.info("Bot läuft...");
    client.user?.setActivity(config.bot_settings.bot_status);
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    if (message.content.startsWith("http") && message.content.match(/\bpr0gramm.com\//i)){
        message.channel.sendTyping().catch(e => log.error(e));
        embedHandler.createEmbed(
            /** @type { import("discord.js").Message & { channel: import("discord.js").GuildChannel }} */ (message),
            (err, data) => {
                if (!data.embed) return;
                if (err) return log.error(`Konnte Embed nicht erstellen: ${err}`);

                const { embed, files } = data;

                message.channel.send({ embeds: [embed], files }).catch(error => {
                    log.error(`Konnte Embed nicht erstellen: ${error}`);

                    if (String(error).toLowerCase().includes("request entity too large")){
                        message.channel.send("Bild/Video zu groß :^(").catch();
                    }
                });

                if (config.bot_settings.delete_user_message) message.delete().catch();
            }
        );
    }
});

client.on("error", err => log.error(err));

log.info("Validiere pr0gramm session...");

login.validSession(isValid => {
    if (isValid) return log.done("Bereits auf pr0gramm eingeloggt");

    log.warn("Noch nicht auf pr0gramm eingelogt. Versuche login...");
    login.performLogin(config.pr0api.username, config.pr0api.password);
});

log.info("Versuche Token login...");

client.login(config.auth.bot_token).then(() => {
    log.done("Token login war erfolgreich!");
}, (err) => {
    log.error(`Token login war nicht erfolgreich: "${err}"`);
    log.error("Schalte wegen falschem Token ab...\n\n");
    process.exit(1);
});
