"use strict";

// Dependencies
let Discord = require("discord.js");

// API
let embedHandler = require("./api/embedHandler");
let login = require("./api/pr0Login");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");

const client = new Discord.Client();

let appname = conf.getName();
let version = conf.getVersion();

console.log(
    "\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n" +
    " # " + appname + " v" + version + " gestartet #\n" +
    " #" + "-".repeat(14 + appname.length + version.toString().length) + "#\n"
);

log.info(`Starte ${appname}...`);
const config = conf.getConfig();

process.on("unhandledRejection", (err, promise) => {
    log.error("Unhandled rejection (promise: " + promise + ", reason: " + err + ")");
});

client.on("ready", () => {
    log.info("Bot läuft...");
    log.info(`${client.users.size} User, in ${client.channels.size} Kanälen von ${client.guilds.size} Gilden registriert`);
    client.user.setActivity(config.bot_settings.bot_status);
});

client.on("guildCreate", (guild) => {
    log.info(`Neuer Gilde beigetreten: ${guild.name} (id: ${guild.id}) mit ${guild.memberCount} mitgliedern`);
});

client.on("guildDelete", (guild) => {
    log.info(`Von Gilde gelöscht: ${guild.name} (id: ${guild.id}).`);
});

client.on("message", message => {
    if (message.author.bot) return;
 
});

client.on("error", (err) => {
    log.error(err);
});

log.info("Validiere pr0gramm session...");

login.validSession((isValid) => {
    if (isValid) log.done("Bereits auf pr0gramm eingeloggt");
    else {
        log.warn("Noch nicht auf pr0gramm eingelogt. Versuche login...");
        login.performLogin(config.pr0api.username, config.pr0api.password);
    }
});

log.info("Versuche Token login...");

client.login(config.auth.bot_token).then(() => {
    log.done("Token login war erfolgreich!");
}, (err) => {
    log.error(`Token login war nicht erfolgreich: "${err}"`);
    log.error("Schalte wegen falschem Token ab...\n\n");
    process.exit(1);
});
