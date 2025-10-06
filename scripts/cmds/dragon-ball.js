const characters = [
  {
    name: "Son Goku (Base)",
    power: 50,
    basic: "Kamehameha 🌊",
    ultimate: "Kaioken x10 💥"
  },
  {
    name: "Son Goku (SSJ)",
    power: 65,
    basic: "Kamehameha 🔥",
    ultimate: "Super Kamehameha 🌌"
  },
  {
    name: "Son Goku (SSJ Blue)",
    power: 80,
    basic: "Kamehameha Divin 💠",
    ultimate: "Kaioken Blue x20 💥💠"
  },
  {
    name: "Son Goku (Ultra Instinct)",
    power: 90,
    basic: "Esquive Parfaite ✨",
    ultimate: "MIGATTE NO GOKUI ☄️"
  },
  {
    name: "Vegeta (SSJ)",
    power: 65,
    basic: "Big Bang Attack 💥",
    ultimate: "Final Flash ⚡🌌"
  },
  {
    name: "Vegeta (Blue)",
    power: 80,
    basic: "Final Flash Divin 💠",
    ultimate: "Evolved Blue Explosion 💥💠"
  },
  {
    name: "Freezer (Golden)",
    power: 78,
    basic: "Death Beam 🔮",
    ultimate: "Golden Death Ball ☢️"
  },
  {
    name: "Broly (Légendaire)",
    power: 85,
    basic: "Écrasement Brutal 💥",
    ultimate: "Gigantic Roar 🦁💥"
  },
  {
    name: "Jiren",
    power: 88,
    basic: "Punch Inarrêtable 👊",
    ultimate: "Meditation Power Up 🔥"
  },
  {
    name: "Beerus",
    power: 90,
    basic: "Sphère de la Destruction ☄️",
    ultimate: "Hakai ⚡💀"
  }
];

const damageSystem = {
  basic: { min: 10, max: 18, chakraCost: 0 },
  special: { min: 18, max: 28, chakraCost: 20 },
  ultimate: { min: 35, max: 55, chakraCost: 75, failChance: 0.25 },
  charge: { chakraGain: 25 }
};

function getHealthColor(hp) {
  if (hp === 100) return "💚";
  if (hp >= 85) return "💚";
  if (hp >= 55) return "💛";
  if (hp >= 25) return "🧡";
  if (hp > 0) return "❤️";
  return "💔";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gameState = {};

module.exports = {
  config: { 
    name: "dragon-ball-storm", 
    version: "1.1",
    author: "kyo soma",
    role: 0,
    category: "game",
    shortDescription: "Jeu Dragon Ball ultime",
    longDescription: "Combat Dragon Ball avec système d’énergie et pouvoirs",
    guide: "{p}dragon-ball-storm"
  },

  onStart: async function ({ message, event }) {
    const threadID = event.threadID;

    gameState[threadID] = {
      step: "waiting_start",
      players: {},
      turn: null,
      p1Character: null,
      p2Character: null,
      p1HP: 100,
      p2HP: 100,
      p1Chakra: 100,
      p2Chakra: 100,
      chakraRegen: 5,
      defending: false,
      lastAction: null,
      lastPlayer: null
    };

    await message.reply(
      `🎮 𝗗𝗥𝗔𝗚𝗢𝗡 𝗕𝗔𝗟𝗟 𝗦𝗧𝗢𝗥𝗠 ⚡\n━━━━━━━━━━━━━━\nEnvoyez "start" pour commencer le combat !`
    );
  },

  // ⚡👉 Ici tu dois copier le bloc `onChat` de ton naruto-storm
  // et remplacer la variable `characters` par celle-ci de Dragon Ball.
};
