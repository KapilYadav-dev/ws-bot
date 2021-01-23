const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const SESSION_FILE_PATH = "./session.json";
const fs = require("fs");
const commands = require("./commands");
let sessionData;

var logo = `
Powered by

███╗   ███╗██████╗ ██╗  ██╗ █████╗ ██╗   ██╗██████╗ ███████╗██╗   ██╗
████╗ ████║██╔══██╗██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔══██╗██╔════╝██║   ██║
██╔████╔██║██████╔╝█████╔╝ ███████║ ╚████╔╝ ██║  ██║█████╗  ██║   ██║
██║╚██╔╝██║██╔══██╗██╔═██╗ ██╔══██║  ╚██╔╝  ██║  ██║██╔══╝  ╚██╗ ██╔╝
██║ ╚═╝ ██║██║  ██║██║  ██╗██║  ██║   ██║   ██████╔╝███████╗ ╚████╔╝ 
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚══════╝  ╚═══╝                                     
`;
console.log(logo);

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
  session: sessionData,
});
client.initialize();

client.on("qr", (qr) => {
  console.log("Scan this QR code with your ws app...");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("message", async (msg) => {
  var message = msg.body;
  if (commands.welcome.query.some((v) => message.toLowerCase().includes(v)))
    msg.reply(commands.welcome.reply);
  else if (commands.hbd.query.some((v) => message.toLowerCase().includes(v)))
    msg.reply(commands.hbd.reply);
});

client.on("change_battery", (batteryInfo) => {
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging- ${plugged}`);
});

client.on("disconnected", (reason) => {
  console.log("User was logged out", reason);
});
