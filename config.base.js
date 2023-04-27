import fs from "node:fs/promises";
import { EOL } from "node:os";
import log from "./src/utils/logger.js";

/* eslint-disable curly */

const stringifyObject = function(obj, indent = 0){
    const indentStr = " ".repeat(indent);
    const entries = Object.entries(obj).map(([key, value]) => {
        if (typeof value === "function")
            return `${indentStr}    ${key}: ${value.toString()},`;
        else if (typeof value === "object" && value !== null)
            return `${indentStr}    ${key}: ${stringifyObject(value, indent + 4)},`;
        return `${indentStr}    ${key}: ${JSON.stringify(value)},`;
    }).join(EOL);
    return `{${EOL}${entries}${EOL}${indentStr}}`;
};

const skeleton = {
    auth: {
        bot_token: "",
    },
    bot_settings: {
        bot_status: "Name ist pr0gramm",
        nsfw_in_nswfchat_only: true,
        disable_nsfl_preview: true,
        delete_user_message: false,
        embed_direct_links: false,
    },
    pr0api: {
        username: "",
        password: "",
        user_agent: "",
        userbot: false,
    },
};

try {
    await fs.access("./config.js");
}
catch (err){
    await fs.writeFile(
        "./config.js",
        `// @ts-nocheck${EOL}/* eslint-disable */${EOL}// prettier-ignore${EOL}${EOL}export default ${
            stringifyObject(skeleton)
        };${EOL}`,
    );
    log.error("Konfigurationsdatei nicht gefunden. Leere config erstellt und Programm beendet.");
    process.exit(1);
}

// @ts-ignore
const configCustom = (await import("./config.js")).default;
const packageJSON = JSON.parse(await fs.readFile("./package.json", "utf-8"));

export const meta = {
    getVersion: () => packageJSON.version,
    getName: () => packageJSON.name,
    getAuthor: () => packageJSON.author,
};

export const config = {
    ...skeleton,
    ...configCustom,
};
