const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Welcome message only when bot joins",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  const dirRandom = __dirname + "/cache/randomgif";
  if (!fs.existsSync(dirRandom)) fs.mkdirSync(dirRandom, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { threadID, logMessageData } = event;
  const botID = api.getCurrentUserID();

  // শুধু তখন কাজ করবে যখন বটকে add করা হবে
  if (logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
    const threadData = await api.getThreadInfo(threadID);
    const botName = global.config.BOTNAME || "Bot";

    // Nickname সেট করা
    api.changeNickname(`[ ${global.config.PREFIX} ] • ${botName}`, threadID, botID);

    // random gif/mp4 থাকলে সেট নেবে
    const randomPath = __dirname + "/cache/randomgif";
    const randomFiles = fs.readdirSync(randomPath);
    const randomFile = randomFiles.length > 0 ? path.join(randomPath, randomFiles[Math.floor(Math.random() * randomFiles.length)]) : null;

    // বট এড হলে প্রথম SMS
    const msg1 = {
      body: `✦─────꯭─⃝‌‌𝐉𝐢𝐬𝐡𝐮𝐮 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦\nচলে এসেছি ${botName} ✅\n\nThanks for adding me in this group ❤️`,
      attachment: randomFile ? fs.createReadStream(randomFile) : null
    };
    api.sendMessage(msg1, threadID);

    // বট intro SMS
    const msg2 = {
      body: `╭──────༺♡༻──────╮
        Assalamualaikum ❤️
╰──────༺♡༻──────╯

আমি ${𝐉𝐈𝐬𝐡𝐮 𝐜𝐡𝐚𝐭 𝐛𝐨𝐭}, আপনার গ্রুপের Chat Bot 🤖

💠 Command দেখতে লিখুন: help
💠 Owner info: info
💠 Admin list: admin

✦─────꯭─⃝‌‌𝐣𝐢𝐬𝐡𝐮𝐮 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭────✦`
    };
    api.sendMessage(msg2, threadID);
  }
};