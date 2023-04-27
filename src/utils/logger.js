// =========================== //
// = Copyright (c) TheShad0w = //
// =========================== //

/**
 * Formats the current time
 *
 * @returns {string} Time
 */
const getDate = function(){
    const date = new Date();
    const hourData = date.getHours();
    const minData = date.getMinutes();
    const secData = date.getSeconds();

    const hour = (hourData < 10 ? "0" : "") + hourData;
    const min = (minData  < 10 ? "0" : "") + minData;
    const sec = (secData  < 10 ? "0" : "") + secData;

    return "[" + hour + ":" + min + ":" + sec + "]";
};

export default {
    error(input){
        console.log(" \x1b[41m\x1b[30m x \x1b[0m\x1b[31m [ERROR] " + getDate() + " - " + input + "\x1b[0m");
    },

    warn(input){
        console.log(" \x1b[43m\x1b[30m ! \x1b[0m\x1b[33m [WARN]  " + getDate() + " - " + input + "\x1b[0m");
    },

    info(input){
        console.log(" \x1b[44m\x1b[30m i \x1b[0m\x1b[36m [INFO]  " + getDate() + " - " + input + "\x1b[0m");
    },

    done(input){
        console.log(" \x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m [DONE]  " + getDate() + " - " + input + "\x1b[0m");
    },
};
