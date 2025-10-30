const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "3.0",
    author: "Camille 💙",
    category: "events"
  },

  langs: {
    en: {
      session1: "matin",
      session2: "midi",
      session3: "après-midi",
      session4: "soir",
      welcomeMessage: `⚡ Yo ! Merci de m'avoir ajouté 💫\nPréfixe du bot: %1\nTape %1help pour toutes mes commandes 👀`,
      multiple1: "toi",
      multiple2: "vous",
      defaultWelcomeMessage: `
╔══════════════════╗
║   ⚽ BLUE LOCK ⚽  ║
╠══════════════════╣
║ 👋 Bienvenue {multiple} {userName} !
║ 🏟️ Groupe : {boxName}
║ ⏰ Moment : {session}
║ 💬 "Le but, c’est d’être le N°1 !" 🔥
╚══════════════════╝`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const hours = getTime("HH");
    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const added = event.logMessageData.addedParticipants;

    // Si le bot est ajouté
    if (added.some(u => u.userFbId === api.getCurrentUserID())) {
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
      return message.send(getLang("welcomeMessage", prefix));
    }

    if (!global.temp.welcomeEvent[threadID]) {
      global.temp.welcomeEvent[threadID] = { joinTimeout: null, added: [] };
    }

    global.temp.welcomeEvent[threadID].added.push(...added);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      if (threadData.settings.sendWelcomeMessage === false) return;

      const addedUsers = global.temp.welcomeEvent[threadID].added;
      const banned = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;
      const userName = [], mentions = [];
      let multiple = addedUsers.length > 1;

      for (const user of addedUsers) {
        if (banned.some(b => b.id === user.userFbId)) continue;
        userName.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (!userName.length) return;

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
      let msg = welcomeMessage
        .replace(/\{userName\}/g, userName.join(", "))
        .replace(/\{boxName\}/g, threadName)
        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
        .replace(/\{session\}/g,
          hours <= 10 ? getLang("session1") :
          hours <= 12 ? getLang("session2") :
          hours <= 18 ? getLang("session3") :
          getLang("session4")
        );

      // Forme finale avec mentions et attachments
      const form = { body: msg, mentions };
      if (threadData.data.welcomeAttachment) {
        const files = threadData.data.welcomeAttachment;
        const attachments = await Promise.allSettled(files.map(f => drive.getFile(f, "stream")));
        form.attachment = attachments.filter(a => a.status === "fulfilled").map(a => a.value);
      }

      await message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
