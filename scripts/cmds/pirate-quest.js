const events = [
  { text: "Tu trouves un coffre au trésor caché ! 💰", gold: 50 },
  { text: "Un requin attaque ton bateau ! 🦈", damage: 20 },
  { text: "Tu pilles un navire marchand 🚢", gold: 30, energyLoss: 10 },
  { text: "Tu bois du rhum pour reprendre des forces 🍺", heal: 15, energyGain: 10 },
  { text: "Une tempête détruit une partie de ton navire ⛈️", damage: 25, energyLoss: 5 },
  { text: "Tu trouves une île mystérieuse avec un trésor 🌴", gold: 40, heal: 10 },
  { text: "Un autre pirate te tend une embuscade ⚔️", damage: 15, gold: -20 }
];

const gameState = {};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  config: { 
    name: "pirate-quest", 
    version: "1.0",
    author: "kyo soma",
    role: 0,
    category: "game",
    shortDescription: "Jeu d’aventure pirate",
    longDescription: "Pars à l’aventure en pirate, trouve des trésors et deviens le plus riche !",
    guide: "{p}pirate-quest"
  },

  onStart: async function ({ message, event }) {
    const threadID = event.threadID;

    if (!gameState[threadID]) {
      gameState[threadID] = {
        players: {},
        alive: true,
        round: 1
      };
    }

    const playerID = event.senderID;
    if (!gameState[threadID].players[playerID]) {
      gameState[threadID].players[playerID] = {
        hp: 100,
        energy: 100,
        gold: 0,
        alive: true
      };
    }

    await message.reply(
      `🏴‍☠️ Bienvenue dans **Pirate Quest** !\n\n` +
      `➡️ Tape "join" pour devenir un pirate.\n` +
      `➡️ Tape "start" quand l’équipage est prêt.`
    );
  },

  onChat: async function ({ message, event }) {
    const threadID = event.threadID;
    const input = event.body.toLowerCase();
    const playerID = event.senderID;

    if (!gameState[threadID]) return;

    // Un joueur rejoint
    if (input === "join") {
      if (!gameState[threadID].players[playerID]) {
        gameState[threadID].players[playerID] = {
          hp: 100,
          energy: 100,
          gold: 0,
          alive: true
        };
        return message.reply(`✅ Nouveau pirate embarqué !\n👥 Pirates actuels : ${Object.keys(gameState[threadID].players).length}`);
      }
    }

    // Démarrer la partie
    if (input === "start" && gameState[threadID].alive) {
      return message.reply(
        `⚓ L’aventure commence !\n➡️ Tapez "explore" pour découvrir une nouvelle île ou un navire.`
      );
    }

    // Explorer une île ou attaquer un navire
    if (input === "explore" && gameState[threadID].alive) {
      const eventRandom = pickRandom(events);
      let result = `📖 ${eventRandom.text}\n`;

      const player = gameState[threadID].players[playerID];
      if (!player.alive) return message.reply("☠️ Ton pirate est déjà mort... tape `{p}pirate-quest` pour recommencer.");

      if (eventRandom.damage) {
        player.hp -= eventRandom.damage;
        result += `💔 Tu perds ${eventRandom.damage} HP.\n`;
      }
      if (eventRandom.energyLoss) {
        player.energy -= eventRandom.energyLoss;
        result += `🔋 Tu perds ${eventRandom.energyLoss} énergie.\n`;
      }
      if (eventRandom.heal) {
        player.hp = Math.min(player.hp + eventRandom.heal, 100);
        result += `❤️ Tu récupères ${eventRandom.heal} HP.\n`;
      }
      if (eventRandom.energyGain) {
        player.energy = Math.min(player.energy + eventRandom.energyGain, 100);
        result += `🔋 Tu regagnes ${eventRandom.energyGain} énergie.\n`;
      }
      if (eventRandom.gold) {
        player.gold += eventRandom.gold;
        result += `💰 Or gagné : ${eventRandom.gold}\n`;
      }

      // Mort ?
      if (player.hp <= 0 || player.energy <= 0) {
        player.alive = false;
        result += `☠️ Ton pirate est mort...\n`;
      } else {
        result += `\n❤️ HP : ${player.hp} | 🔋 Énergie : ${player.energy} | 💰 Or : ${player.gold}`;
      }

      return message.reply(result);
    }

    // Classement
    if (input === "score") {
      let scores = "🏆 Classement des pirates :\n\n";
      const players = gameState[threadID].players;
      const sorted = Object.entries(players).sort(([,a],[,b]) => b.gold - a.gold);
      sorted.forEach(([pid, p], i) => {
        scores += `${i+1}. ${pid} → 💰 ${p.gold} | ❤️ ${p.hp} | 🔋 ${p.energy}\n`;
      });
      return message.reply(scores);
    }
  }
};
