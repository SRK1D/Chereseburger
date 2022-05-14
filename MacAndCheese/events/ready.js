module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`[BOT] => Starting up.`);
        console.log(`[BOT] => Logged in\nUser: ${client.user.tag}`);
		client.user.setActivity('Some servers', { type: 'WATCHING' });
	},
};