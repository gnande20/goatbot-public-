const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "setbotpfp",
    aliases: ["setavt", "changeavatar"],
    version: "2.6",
    author: "Kyo Soma ✦",
    countDown: 5,
    role: 2,
    shortDescription: "Change la photo de profil du bot avec élégance",
    longDescription: "Permet à l'administrateur de modifier la photo de profil du bot via une image jointe, une réponse à un message contenant une image, ou une URL directe.",
    category: "admin",
    guide: {
      fr: "Utilisation : {pn} [url image] ou en répondant à une image"
    }
  },

  langs: {
    fr: {
      noImage: "⚠️ | Envoie ou répond à une image pour changer la photo du bot.",
      downloading: "⏳ | Téléchargement de l'image... la perfection se prépare.",
      success:
`╭━━━[ 𝐊𝐘𝐎 𝐒𝐎𝐌𝐀 ]━━━╮
│ ✅ Mission accomplie.
│ Le bot affiche désormais un nouveau visage.
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
      failed:
`╭━━━[ 𝐊𝐘𝐎 𝐒𝐎𝐌𝐀 ]━━━╮
│ ❌ Une erreur est survenue.
│ Le changement d'avatar a échoué.
╰━━━━━━━━━━━━━━━━━━━━━━╯`
    }
  },

  onStart: async function ({ message, event, api, args, getLang }) {
    let imageURL;

    // --- Vérifie la source de l'image
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imageURL = event.messageReply.attachments[0].url;
    } else if (event.attachments?.[0]?.type === "photo") {
      imageURL = event.attachments[0].url;
    } else if (args[0]?.startsWith("http")) {
      imageURL = args[0];
    }

    // --- Si aucune image trouvée
    if (!imageURL)
      return message.reply(getLang("noImage"));

    const path = __dirname + "/cache/kyo_avatar.jpg";

    try {
      message.reply(getLang("downloading"));

      // --- Téléchargement de l’image
      const response = await axios.get(imageURL, { responseType: "arraybuffer" });
      await fs.writeFile(path, Buffer.from(response.data, "binary"));

      // --- Application de la photo de profil
      await api.changeAvatar(fs.createReadStream(path), (err) => {
        fs.unlinkSync(path);
        if (err) {
          console.error(err);
          return message.reply(getLang("failed"));
        }

        // --- Message de succès stylé
        return message.reply(getLang("success"));
      });

    } catch (err) {
      console.error("Erreur setbotpfp:", err);
      return message.reply(getLang("failed"));
    }
  }
};
