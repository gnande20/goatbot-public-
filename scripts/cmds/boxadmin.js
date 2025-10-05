//========================================//
//   📦 Commande : box (envoi aux admins)
//   🧠 Auteur : Kyo Soma
//========================================//

module.exports = {
  config: {
    name: "boxadmin",
    aliases: ["cadreadmin", "encadreradmin"],
    version: "1.0",
    author: "Kyo Soma",
    countDown: 3,
    role: 2, // seulement pour les admins
    shortDescription: "Créer un encadré et l’envoyer à tous les admins",
    category: "utility"
  },

  onStart: async function ({ api, event, args }) {
    try {
      const input = args.join(" ").trim();
      if (!input) {
        return api.sendMessage(
          "📦 | Utilisation : boxadmin <titre>|<texte>\nExemple : boxadmin Annonce|Réunion à 20h",
          event.threadID,
          event.messageID
        );
      }

      let title = "";
      let message = input;
      const sep = input.indexOf("|");
      if (sep !== -1) {
        title = input.slice(0, sep).trim();
        message = input.slice(sep + 1).trim();
      }

      if (!message) return api.sendMessage("❌ | Le message après `|` est vide.", event.threadID, event.messageID);

      const lines = message.split("\n").map(l => l.trim());
      const titleLines = title ? title.split("\n").map(l => l.trim()) : [];
      const allLines = [...titleLines, ...lines];
      const width = Math.max(...allLines.map(l => l.length), 10);

      const padCenter = (text, w) => {
        const space = w - text.length;
        const left = Math.floor(space / 2);
        const right = space - left;
        return " ".repeat(left) + text + " ".repeat(right);
      };

      const top = `╭━${"━".repeat(width)}━╮`;
      const bottom = `╰━${"━".repeat(width)}━╯`;
      let content = top + "\n";

      if (titleLines.length > 0) {
        for (const t of titleLines) {
          content += `┃ ✦ ${padCenter(t, width - 2)} ┃\n`;
        }
        content += `┣${"━".repeat(width + 2)}┫\n`;
      }

      for (const l of lines) {
        content += `┃ ${padCenter(l, width)} ┃\n`;
      }

      content += bottom;

      // Récupérer tous les admins
      const admins = global.GoatBot.config.admins || [];
      for (const adminID of admins) {
        await api.sendMessage(content, adminID);
      }

      return api.sendMessage("✅ | Encadré envoyé à tous les administrateurs.", event.threadID, event.messageID);

    } catch (error) {
      console.error("Erreur dans boxadmin.js :", error);
      return api.sendMessage("❌ | Une erreur est survenue lors de l’envoi aux admins.", event.threadID, event.messageID);
    }
  }
};
