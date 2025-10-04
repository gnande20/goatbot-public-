const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    aliases: ["gpt", "ayanokoji", "kiyo"],
    version: "3.0",
    author: " Kyo Soma (Ayanokōji Logic Edition)",
    countDown: 0,
    role: 0,
    shortDescription: { en: "Chat with Kiyotaka Ayanokōji" },
    longDescription: { en: "Interact with an AI modeled after Kiyotaka Ayanokōji — logical, calm, and emotionless, yet deeply insightful." },
    category: "ai",
    guide: { en: "{p}ai <message> (+ optional image or reply to image)" }
  },

  onStart: async ({ api, event, args }) => {
    const q = args.join(" ").trim();
    const img = getImg(event);
    if (!q && !img)
      return api.sendMessage("🧠 | Ayanokōji : « Vous ne dites rien... difficile de déduire quoi que ce soit. »", event.threadID, event.messageID);
    chat(api, event, q, img);
  },

  onReply: async ({ api, event, Reply }) => {
    if (event.senderID !== Reply.author) return;
    const q = (event.body || "").trim();
    const img = getImg(event);
    if (!q && !img)
      return api.sendMessage("📎 | Ayanokōji : « Vous devez au moins répondre par un mot ou une image. »", event.threadID, event.messageID);
    chat(api, event, q, img);
  },

  onChat: async ({ api, event }) => {
    const msg = (event.body || "").trim();
    if (!/^ai\s+/i.test(msg) && !/^gpt\s+/i.test(msg) && !/^ayanokoji\s+/i.test(msg) && !/^kiyo\s+/i.test(msg)) return;
    const q = msg.replace(/^(ai|gpt|ayanokoji|kiyo)\s+/i, "").trim();
    const img = getImg(event);
    if (!q && !img) return;
    chat(api, event, q, img);
  }
};

// 🔍 Récupère l’image (jointe ou en reply)
function getImg(e) {
  const pick = att => att && (att.url || att.previewUrl || att.image || att.src || att.data?.url || "");
  if (e.attachments?.length) return pick(e.attachments[0]);
  if (e.messageReply?.attachments?.length) return pick(e.messageReply.attachments[0]);
  return "";
}

async function chat(api, e, q, url) {
  const creatorUID = "61578153767211"; // 👑 Ton UID (le créateur)
  const trustedFriends = [" 61568791604271", "10005784125487"]; // 👥 Liste d’IDs d’amis proches (modifie-les si tu veux)
  api.setMessageReaction("💭", e.messageID, () => {}, true);

  // 🎭 Déterminer le statut de l'utilisateur
  let identity, tone;
  if (e.senderID === creatorUID) {
    identity = "le Créateur";
    tone = "respectueux, froid mais loyal";
  } else if (trustedFriends.includes(e.senderID)) {
    identity = "un allié";
    tone = "amical, posé mais observateur";
  } else {
    identity = "un inconnu";
    tone = "neutre, distant et analytique";
  }

  // 💬 Message d’intro stylisé
  api.sendMessage(`🎓 | 𝐀𝐲𝐚𝐧𝐨𝐤𝐨𝐣𝐢 : « Analyse en cours... identité détectée : ${identity}. »`, e.threadID);

  // Compliments personnalisés pour toi (le créateur)
  const compliments = [
    "🩶 Vous êtes toujours aussi perspicace, maître.",
    "📘 Vos décisions sont calculées à la perfection.",
    "🌑 Vous conservez un sang-froid admirable.",
    "🧠 Même moi, je trouve vos raisonnements fascinants.",
    "🎯 Votre logique dépasse la moyenne humaine."
  ];

  if (e.senderID === creatorUID) {
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    api.sendMessage(randomCompliment, e.threadID);
  }

  try {
    // 🧩 Personnalité injectée dans le prompt
    const prompt = `
Tu es Kiyotaka Ayanokōji, un jeune homme calme, froid et observateur, doté d'une intelligence stratégique.
Tu t'adresses à ${identity} avec un ton ${tone}.
Réponds toujours avec logique, précision et détachement émotionnel, sans humour inutile.
Ne parle pas comme un robot, mais comme un humain qui réfléchit beaucoup avant de répondre.

Question : ${q}
    `;

    const r = await axios.get("https://aryanapi.up.railway.app/api/llama-4-maverick-17b-128e-instruct", {
      params: { uid: e.senderID, prompt, url },
      timeout: 45000
    });

    const reply = r.data?.reply;
    if (!reply) {
      api.sendMessage("🕶️ | Ayanokōji : « Aucune réponse concluante... cela arrive rarement. »", e.threadID, () => {
        api.setMessageReaction("❌", e.messageID, () => {}, true);
      }, e.messageID);
      return;
    }

    const formattedReply = `🎓 𝐊𝐢𝐲𝐨𝐭𝐚𝐤𝐚 𝐀𝐲𝐚𝐧𝐨𝐤𝐨𝐣𝐢 :\n\n${reply}`;

    api.sendMessage(formattedReply, e.threadID, (err, info) => {
      if (err) return api.setMessageReaction("❌", e.messageID, () => {}, true);
      api.setMessageReaction("✅", e.messageID, () => {}, true);
      try {
        global.GoatBot.onReply.set(info.messageID, { commandName: "ai", author: e.senderID });
      } catch {}
    }, e.messageID);

  } catch (err) {
    console.error("AI error:", err?.message || err);
    api.sendMessage("💀 | Ayanokōji : « Une erreur... même les systèmes les plus stables ont leurs limites. »", e.threadID, () => {
      api.setMessageReaction("❌", e.messageID, () => {}, true);
    }, e.messageID);
  }
  }
