// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/* eslint-disable consistent-return */

import { Client, GatewayIntentBits } from "discord.js";
import embedHandler from "./api/embedHandler.js";
import login from "./api/pr0Login.js";
import { config, meta } from "../config.base.js";
import log from "./utils/logger.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const appname = meta.getName();
const version = meta.getVersion();

console.log(
    "\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n" +
    " # " + appname + " v" + version + " gestartet #\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n",
);

log.info(`Starte ${appname}...`);

process.on("unhandledRejection", (err, promise) => {
    log.error("Unhandled rejection (promise: " + JSON.stringify(promise) + ", reason: " + err + ")");
});

client.on("ready", () => {
    log.info("Bot läuft...");
    client.user?.setActivity(config.bot_settings.bot_status);
});

client.on("messageCreate", message => {
    if (message.author.bot) return;

    if (message.content.match(/\bpr0gramm.com\//i)){
        if ( // @ts-ignore
            !(message.channel).permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")
        ) return;

        embedHandler.createEmbed(
            /** @type { import("discord.js").Message & { channel: import("discord.js").GuildChannel }} */ (message),
            (err, data) => {
                if (!data?.embed) return;
                if (err) return log.error(`Konnte Embed nicht erstellen: ${err}`);

                const { embed, files } = data;

                message.channel.send({ embeds: [embed], files }).catch(error => {
                    log.error(`Konnte Embed nicht erstellen: ${error}`);

                    if (String(error).toLowerCase().includes("request entity too large")){
                        message.channel.send("Bild/Video zu groß :^(").catch();
                    }
                });

                if (config.bot_settings.delete_user_message) message.delete().catch();
            },
        );
    }
});

client.on("error", err => log.error(err));

log.info("Validiere pr0gramm session...");

const done = () => client.login(config.auth.bot_token).then(() => {
    log.done("Token login war erfolgreich!");
}, (err) => {
    log.error(`Token login war nicht erfolgreich: "${err}"`);
    log.error("Schalte wegen falschem Token ab...\n\n");
    process.exit(1);
});

login.validSession(isValid => {
    if (isValid){
        log.done("Bereits auf pr0gramm eingeloggt");
        return done();
    }
    log.warn("Noch nicht auf pr0gramm eingelogt. Versuche login...");
    login.performLogin(config.pr0api.username, config.pr0api.password, () => done());
});
