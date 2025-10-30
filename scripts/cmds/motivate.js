module.exports = {
  config: {
    name: "motivate",
    version: "1.0",
    author: "Camille 💙",
    role: 0,
    description: { en: "Send a motivational message to the group" },
    category: "fun",
    guide: { en: "{pn} <message>" }
  },

  onStart: async ({ args, message }) => {
    if (!args[0]) return message.reply("❌ Please enter a motivational message.");

    const motivation = args.join(" ");
    const msg = `╔════[ BLUE LOCK MOTIVATION ]════╗
║ ⚡ ${motivation}
╚═══════════════════════════════╝`;

    await message.reply(msg);
  }
};
