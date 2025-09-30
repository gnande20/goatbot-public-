module.exports = {
    name: "maitre",
    description: "Commandes avancées réservées à l'admin",
    execute: async (message, args, goabot) => {
        const adminID = "61578153767211"; // Remplace par ton ID d'admin

        if(message.senderID !== adminID) {
            return goabot.sendMessage("❌ Vous n'êtes pas autorisé à utiliser cette commande.", message.senderID);
        }

        const input = args.join(" ").toLowerCase();

        // Toujours appeler l'admin "maitre"
        goabot.sendMessage("Oui maitre, que puis-je faire pour vous ?", message.senderID);

        // Stockage des réponses personnalisées et to-do list
        if(!goabot.customResponses) goabot.customResponses = {};
        if(!goabot.todoList) goabot.todoList = [];

        // Commandes avancées
        if(input.startsWith("enregistre ")) {
            const parts = input.slice(10).split("=");
            if(parts.length === 2){
                const cmd = parts[0].trim();
                const response = parts[1].trim();
                goabot.customResponses[cmd] = response;
                return goabot.sendMessage(`✅ Réponse personnalisée enregistrée pour "${cmd}"`, message.senderID);
            } else {
                return goabot.sendMessage("❌ Format invalide. Utilisez : enregistre commande=réponse", message.senderID);
            }
        } else if(input.startsWith("todo ajoute ")) {
            const task = input.slice(11).trim();
            goabot.todoList.push(task);
            return goabot.sendMessage(`✅ Tâche ajoutée à la liste : "${task}"`, message.senderID);
        } else if(input === "todo liste") {
            if(goabot.todoList.length === 0) return goabot.sendMessage("📋 La to-do list est vide.", message.senderID);
            return goabot.sendMessage("📋 To-do list :\n" + goabot.todoList.map((t,i)=>`${i+1}. ${t}`).join("\n"), message.senderID);
        } else if(goabot.customResponses[input]) {
            return goabot.sendMessage(goabot.customResponses[input], message.senderID);
        } else {
            switch(input){
                case "allume la lumière":
                    goabot.sendMessage("💡 Lumière allumée !", message.senderID);
                    break;
                case "eteins la lumière":
                    goabot.sendMessage("💡 Lumière éteinte !", message.senderID);
                    break;
                case "statut":
                    goabot.sendMessage("🤖 Je fonctionne normalement, maitre !", message.senderID);
                    break;
                case "heure":
                    goabot.sendMessage(`⏰ Il est ${new Date().toLocaleTimeString()}`, message.senderID);
                    break;
                case "aide":
                    goabot.sendMessage("📜 Commandes : allume la lumière, eteins la lumière, statut, heure, aide, enregistre, todo ajoute, todo liste", message.senderID);
                    break;
                default:
                    goabot.sendMessage("❌ Commande inconnue, maitre.", message.senderID);
            }
        }
    }
}
