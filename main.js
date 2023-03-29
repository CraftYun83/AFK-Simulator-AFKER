const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const registry = require('prismarine-registry')('1.8')
const ChatMessage = require('prismarine-chat')(registry)
const express = require("express")
const expressWs = require("express-ws")
const http = require("http")

const regex = /\u00A7[0-9A-FK-OR]/gi;
let XPCount = 0;

let port = 6942;
let app = express();
let server = http.createServer(app).listen(port);    
let players = []

expressWs(app, server);

app.ws('/', async function(ws, req) {
    players.push(ws)
    ws.on('message', async function(msg) {
      players.forEach((websocket) => {
        websocket.send(":chatUpdate:"+" >> "+msg)
      })
        bot.chat(msg)
    });
    ws.on("close", function(err) {
        players.splice(players.indexOf(ws), 1);
    })
});

let bot = mineflayer.createBot({
  host: 'mc.hypixel.net',
  auth: 'microsoft',
  version: "1.8.9"
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: 3007, firstPerson: true })
  bot.chat("/visit mousemouse")
})

bot.on("message", (jsonMsg, position, sender, verified) => {
  if (position === "chat") {
      players.forEach((ws) => {
        ws.send(":chatUpdate:"+jsonMsg.toString())
      })
  }
});

bot.on('windowOpen', (window) => {
  console.log("window opened");
  bot.clickWindow(12, 0, 0);
})


bot._client.on('packet', (data, metadata) => {
    if (metadata.name === 'scoreboard_team') {
      let final = data.prefix+data.suffix;
      let m;

        while ((m = regex.exec(final)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                final = final.replaceAll(match, "")
            });
        }
        
        final = final.toString().replace("§l", "")
        final = final.replaceAll("Bonus", "")
        if (final.includes("XP")) {
            final = final.split(": ")[1]
            final = final.replaceAll(",", "")
            final = parseInt(final)
            XPCount = final
            players.forEach((ws) => {
              ws.send(":xpUpdate:"+XPCount)
            })
        }
    }
  });