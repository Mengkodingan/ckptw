const {
  DisconnectReason,
  getContentType,
  BufferJSON,
  useMultiFileAuthState,
  default: makeWASocket
} = require("@adiwajshing/baileys");
const { Collection } = require("@discordjs/collection");
const { Boom } = require("@hapi/boom");
const { toLog } = require("@mengkodingan/tolog");
const { default: axios } = require("axios");
const EventEmitter = require('events');
const ee = new EventEmitter();
const { default: pino } = require("pino");
const { checkQR } = require("../Models/functions");
const ms = require('ms')

module.exports = class Client {
  constructor({
    name = undefined,
    prefix = undefined,
    autoRead = false,
    authFolder = "./state",
    printQRInTerminal = true,
    owners = []
  }) {
    if (!name) throw new Error("[ckptw] name required!");

    if (typeof prefix == "string") {
      prefix = prefix.split();
    }

    if (!prefix) throw new Error("[ckptw] prefix required!");

    this.NAME = name;
    this.PREFIX = prefix;
    this.AUTH_FILE = authFolder;
    this.CMD = new Collection();
    this.cooldown = new Collection();
    this.autoRead = autoRead;
    this.printQRInTerminal = printQRInTerminal;
    this.ev = ee;
    this.owners = owners;
  }

  getWaWebVer() {
    let version = [2, 2306, 7];
    try {
      let { data } = axios.get(
        "https://web.whatsapp.com/check-update?version=1&platform=web"
      );
      version = [data.currentVersion.replace(/[.]/g, ", ")];
    } catch {
      version = version;
    }
    return version;
  }

  onConnectionUpdate(c) {
    this.whats.ev.on("connection.update", async (update) => {
      let c;
      let self = this;
      checkQR(c, self, update, m => this.ev.emit('QR', m));
      c? c(update) : ""
      const { connection, lastDisconnect, isNewLogin } = update;
      if (connection === "close") {
        const reason = lastDisconnect.error
          ? new Boom(lastDisconnect)?.output.statusCode
          : 0;

        if (reason === DisconnectReason.loggedOut) {
          console.log(
            "Device Logged Out, Please Delete Session file and Scan Again."
          );
        } else if (reason === DisconnectReason.badSession) {
          toLog(4, 'Bad session file...');
          toLog(1, "Reconnecting...");
          this.launch();
          isNewLogin ? toLog(
            1,
            "Should be connected to Whatsapp now. You can exit this process with CTRL+C and rerun if the Whatsapp is not loading anymore."
          ) : '';
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed....");
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server...");
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log(
            "Connection Replaced, Another New Session Opened, Please Close Current Session First"
          );
          process.exit();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required!");
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut...");
        } else {
          console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
      }
		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
      this.makeReady()
		}
    });
  }

  onCredsUpdate() {
    this.whats.ev.on("creds.update", this.saveCreds);
  }

  onMessage(c) {
    this.whats.ev.on("messages.upsert", async (m) => {
      this.ev.emit("MessagesUpsert", m);
      c? c(m) : '';
      this.m = m;
      let self = { ...this, getContentType };

      if (this.autoRead) {
        this.whats.readMessages([
          {
            remoteJid: m.messages[0].key.remoteJid,
            id: m.messages[0].key.id,
            participant: m.messages[0].key.participant
          },
        ]);
      }


      await require("../Handler/Commands")(self);
    });
  }

  command(...args) {
    for (const w of args) {
      if (!w.name) throw new Error("name required in commands!");
      if (!w.code) throw new Error("code required in commands!");

      this.CMD.set(w.name, w);
    }
  }

  makeReady() {
		this.connect = true;
    this.readyAt = Date.now();
    this.ev.emit("ClientReady", this.whats);
  }
  
  get uptime() {
    return {
      ms: this.readyAt,
      human: ms(Date.now() - this.readyAt, { long: true }),
    };
  }
  
  async launch() {
    const { state, saveCreds } = await useMultiFileAuthState(this.AUTH_FILE);
    this.state = state;
    this.saveCreds = saveCreds;
    this.whats = await makeWASocket({
      logger: pino({ level: "fatal" }),
      printQRInTerminal: this.printQRInTerminal,
      auth: this.state,
      browser: [this.NAME, "Chrome", "1.0.0"],
      version: this.getWaWebVer(),
    });

    this.onConnectionUpdate();
    this.onCredsUpdate();
    this.onMessage();

    this.whats.ev.on('groups.upsert', (m) => {
      this.ev.emit('GroupsJoin', m)
    });
  }
};

require("../Handler/Prototype");
