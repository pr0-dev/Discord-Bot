# Discord-Bot

<p align="center"><img height="150" width="auto" src="https://i.imgur.com/ff7vivP.png" /></p>
<p align="center"><b>pr0gramm Discord Embed-Bot</b></p>
<hr>

## :question: Was macht es?

Dieser Bot erlaubt es dir, im Discord verlinkte pr0gramm Uploads, User und Kommentare mit einem Embed dazustellen.

Siehe: https://discord.pr0gramm.com/

<hr>

## :satellite: Bot einladen

[![Invite](https://i.imgur.com/MCuTS88.png)](https://discordapp.com/oauth2/authorize?client_id=545621952849510400&scope=bot&permissions=125952)

<sub>Der oben verlinkte Bot ist immer die aktuellste Version dieses Repositories. Für die Authentifizierung wurde [TheShad0w](https://pr0gramm.com/user/TheShad0w)'s [nutzer-bot](https://pr0gramm.com/faq:user-status) "[Shad0wBot](https://pr0gramm.com/user/Shad0wBot)" verwendet. <br>
Alternativ: Selber hosten. Anleitung unten zu finden ⏬ </sub>

<hr>

## :diamond_shape_with_a_dot_inside: Funktionswünsche & Issues

Funktionswunsch oder Fehler entdeckt? Bitte [öffne einen Issue](https://github.com/pr0-dev/Discord-Bot/issues/new/choose) hier auf GitHub.

<hr>

## :wrench: Installation

0. Terminal aufmachen und dorthin navigieren, wo man es downloaden möchte <br><br>
1. Sichergehen, dass NodeJS installiert ist. Teste mit: <br>
$ `node -v` <br>
Wenn es eine Versionsnummer zurückgibt, ist NodeJS installiert.
 **Wenn nicht**, NodeJS <a href="https://nodejs.org/en/download/package-manager/">hier</a> downloaden. <br><br>
2. Repository clonen und hinein navigieren. Wenn Git installiert ist: <br>
$ `git clone https://github.com/pr0-dev/Discord-Bot.git && cd Discord-Bot` <br>
Wenn nicht, <a href="https://github.com/pr0-dev/Discord-Bot/archive/master.zip">hier</a> herunterladen und die ZIP extrahieren. <br>
Dann in den Ordner navigieren.<br><br>
3. Dependencies installieren: <br>
$ `npm install`<br><br>
4. Das Config-Template [config.template.json](https://github.com/pr0-dev/Discord-Bot/blob/master/config.template.json) kopieren und als `config.json` einfügen.<br><br>
5. Die frisch kopierte Config datei ausfüllen. <br><br>
6. Das Script starten <br>
$ `npm start` <br><br>

<hr>

## :nut_and_bolt: Konfiguration

Wenn die Konfigurationsdatei wie bei [Schritt 4](#wrench-installation) kopiert wurde, kann `config.json` angepasst werden:

| Config Key | Erklärung | Erlaubte Werttypen | Standardwert |
| ---------- | --------- | ------------------ | ------------ |
| auth: <br> `bot_token` | Der Bot Token des Discord Bots, kann [hier](https://discordapp.com/developers/) erstellt werden. | String | N/A |
| bot_settings: <br> `bot_status` | Der Status der bei "Spielt..." in Discord angezeigt wird. | String | "Name ist pr0gramm"
| bot_settings: <br> `nsfw_in_nswfchat_only` | Deaktiviert die Vorschau von NSFW Posts in Discord Kanälen, in denen NSFW nicht aktiviert wurde. | Boolean | true |
| bot_settings: <br> `disable_nsfl_preview` | Deaktiviert die Vorschau von NSFL Posts, da diese gegen die Discord ToS verstoßen. | Boolean | true | 
| bot_settings: <br> `delete_user_message` | Löscht den original link des Users sodass nur das Embed bleibt. | Boolean | false |
| pr0api: <br> `username` | Der pr0gramm Username, der für das Anzeigen von NSFW/NSFL/NSFP benutzt wird. | String | N/A |
| pr0api: <br> `password` | Das zum pr0gramm username zugehörige Passwort. | String | N/A |

<hr>
