module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
        const client = member.client
		const guildConf = client.settings.get(member.guild.id);
		if(guildConf.welcomeChannel === "none") return
		const xd = member.guild.channels.cache.find(channel => channel.name === client.settings.get(member.guild.id, "welcomeChannel"))
		if(xd == undefined) return
		let welcomeMessage = client.settings.get(member.guild.id, "welcomeMessage");

		// Our welcome message has a bit of a placeholder, let's fix that:
		welcomeMessage = welcomeMessage.replaceAll("{{user}}", `<@${member.user.id}>`)
		welcomeMessage = welcomeMessage.replaceAll("{{server}}", member.guild.name)
		xd.send(welcomeMessage)
	},
};