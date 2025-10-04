const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.7",
    author: "Dan jersey",
    category: "events"
  },

  langs: {
    vi: {
      session1: "sáng",
      session2: "trưa",
      session3: "chiều",
      session4: "tối",
      defaultLeaveMessage: "{userName} đã rời nhóm. Không có gì thay đổi."
    },
    en: {
      session1: "matin",
      session2: "midi",
      session3: "après-midi",
      session4: "soir",
      defaultLeaveMessage: "{userName} a quitté le groupe. Rien de notable."
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageData, author } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendLeaveMessage) return;

    const leftId = logMessageData.leftParticipantFbId;
    if (leftId === api.getCurrentUserID()) return;

    const hours = parseInt(getTime("HH"));
    const userName = await usersData.getName(leftId);
    const threadName = threadData.threadName;

    // Messages de départ ultra Kiyotaka : analyse subtile + sarcasme
    const kiyotakaMessages = [
      `Ah, ${userName} s'en va… prévisible, mais logique.`,
      `${userName} a quitté le groupe. Je note son absence, même si elle n'a aucune importance.`,
      `Le départ de ${userName} est… attendu. Rien ne change vraiment.`,
      `${userName} a quitté. Je me demande si quelqu'un s'en est réellement rendu compte.`,
      `Intéressant. ${userName} s’en va. Une décision qui révèle beaucoup… ou rien du tout.`,
      `${userName} disparaît. Comme je l’avais prédit, rien de significatif n’a été perdu.`,
      `${userName} quitte le groupe. Les dynamiques resteront intactes. Prudent.`,
      `Je remarque que ${userName} part. Peut-être une stratégie personnelle… ou juste l’ennui.`
    ];

    // Choisir un message aléatoire pour plus de réalisme
    let leaveMessage = kiyotakaMessages[Math.floor(Math.random() * kiyotakaMessages.length)];

    leaveMessage = leaveMessage
      .replace(/\{userName\}|\{userNameTag\}/g, userName)
      .replace(/\{type\}/g, leftId === author ? "a quitté" : "a été expulsé de")
      .replace(/\{threadName\}|\{boxName\}/g, threadName)
      .replace(/\{time\}/g, hours)
      .replace(/\{session\}/g,
        hours <= 10 ? "matin" :
        hours <= 12 ? "midi" :
        hours <= 18 ? "après-midi" : "soir"
      );

    const form = { body: leaveMessage };

    if (leaveMessage.includes("{userNameTag}")) {
      form.mentions = [{ id: leftId, tag: userName }];
    }

    if (threadData.data.leaveAttachment?.length) {
      const attachments = await Promise.all(
        threadData.data.leaveAttachment.map(file => drive.getFile(file, "stream").catch(() => null))
      );
      form.attachment = attachments.filter(Boolean);
    }

    message.send(form);
  }
};
