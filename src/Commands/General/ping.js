const Command = require('../../Structures/Command');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "ping",
            description: "Ping command",
            category: "General",
            offerSlash: true
        })
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
        this.createSlash(builder);
    }
    async execute(interaction) {
        interaction.reply({ content: `Ping! ${this.client.ws.ping}ms` })
    }
}