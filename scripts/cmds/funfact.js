module.exports = {
  config: {
    name: "funfact",
    version: "1.0",
    author: "Camille 💙",
    role: 0,
    description: { en: "Send a fun fact about Blue Lock or football" },
    category: "fun",
    guide: { en: "{pn}" }
  },

  onStart: async ({ message }) => {
    const facts = [
      "⚡ Jin a marqué 15 buts imaginaires en un entraînement !",
      "🔥 Meguru a battu tous ses records de vitesse aujourd’hui !",
      "⚽ Chaque penalty compte… même dans l’imaginaire !",
      "💥 Le travail d’équipe est la clé pour devenir le meilleur attaquant !",
      "🏆 Ego Jin dit : 'Seul le plus fort peut marquer le but parfait.'"
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];

    const msg = `╔════[ BLUE LOCK FACT ⚡ ]════╗
║ ${fact}
╚═════════════════════════════╝`;

    await message.reply(msg);
  }
};
