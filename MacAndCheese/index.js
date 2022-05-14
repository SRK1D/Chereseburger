const fs = require("fs");
const Enmap = require('enmap');
const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config();

console.log(`[BOT] => Client loaded.`)
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
client.Connection
client.recordable = new Map();

client.settings = new Enmap({
    name: "settings",
    fetchAll: true,
    autoFetch: true,
    dataDir: "./db/",
    cloneLevel: 'deep',
    autoEnsure: {
        language: "en",
        modLogChannel: "mod-log",
        modRole: "Moderator",
        adminRole: "Administrator",
        welcomeChannel: "none",
        welcomeMessage: "Say hello to {{user}}, everyone!"
    }
});

console.log(`[BOT] => DataBase loaded.`)

console.log(`[BOT] => Starting up commands.`)
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	console.log(`[BOT] => ${command.data.name}.js loaded.`)
}

console.log(`[BOT] => Starting up events.`)
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log(`[BOT] => ${event.name}.js loaded.`)
}

client.on("guildDelete", guild => {
	// When the bot leaves or is kicked, delete settings to prevent stale entries.
	client.settings.delete(guild.id);
  });

console.log(`[BOT] => Starting up modules.`)
fs.readdir(`./modules/`, (err, files) => {
    if (err) {
        throw err
    }
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        require(`./modules/${file}`)(client);
		console.log(`[BOT] => ${file} loaded.`)
    }
});

//client.user.setActivity('Hillview County', { type: 'WATCHING' });

client.login(process.env.TOKEN)