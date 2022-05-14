const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setsetting')
		.setDescription('Send a message to a specified user')
		.addStringOption(option =>
			option.setName('setting')
				.setDescription('Setting to change')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('parameter')
				.setDescription('Parameter to set')
				.setRequired(true)),

	async execute(interaction) {
	let con = true
		if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			await interaction.reply("insufficient permission")
			return
		}
		const client = interaction.client
		const guildConf = client.settings.ensure(interaction.guild.id);
		const prop  = interaction.options.getString('setting');
		const value = interaction.options.getString('parameter');
        if(!interaction.client.settings.has(interaction.guild.id, prop)) {
			let configProps = Object.keys(guildConf).map(prop => {
				return `${prop},`;
			  });
            return interaction.reply(`Invalid prop. Here is the list of the server setting:\n \`\`\`${configProps.join("\n")}\`\`\``);
          }
      
          // Now we can finally change the value. Here we only have strings for values 
          // so we won't bother trying to make sure it's the right type and such. 
          interaction.client.settings.set(interaction.guild.id, value, prop);
      
          // We can confirm everything's done to the client.
          interaction.reply(`Guild configuration item ${prop} has been changed to:\n\`${value}\``);
      
		
	},
};
