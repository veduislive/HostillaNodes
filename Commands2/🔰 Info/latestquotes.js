const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  swap_pages
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment");
module.exports = {
  name: "latestquotes",
  aliases: ["lastquotes", "latestquote", "lastquote"],
  category: "🔰 Info",
  description: "Shows the latest Quotes which are saved on this User/you",
  usage: "latestquotes [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //"HELLO"
      var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      var user = member ? member.user : message.author;
      if(user.id != message.author.id) {
        args.shift();
      }
      client.afkDB.ensure(user.id, {
        quotes: [
          /*
          { by: "id", text: "", image: null, at: Date.now(), }
          */
        ]
      })
      let data = client.afkDB.get(user.id, "quotes")
      if(args[0] && !isNaN(args[0])){
        if(Number(args[0]) < 0 || Number(args[0]) > data.length - 1 || !data[Number(args[0])] || !data[Number(args[0])].text){
          return message.reply(`<:M_x:933261310588760115> **Invalid Quote ID!**\n> Use one between \`0\` and \`${data.length - 1}\``)
        }
        let embed = new MessageEmbed()
          .setColor(es.color)
          .setFooter(user.id, user.displayAvatarURL({dynamic: true}))
          .addField("**Quote by:**", `<@${data[Number(args[0])].by}>`)
          .addField("**Quote at:**", `\`\`\`${moment(data[Number(args[0])].at).format("DD/MM/YYYY HH:mm")}\`\`\``)
          .setTitle("**Quote Text:**")
          .setDescription(`${String(data[Number(args[0])].text).substring(0, 2000)}`)
        if(data[Number(args[0])].image){
          embed.setImage(data[Number(args[0])].image)
        }
        return message.reply({embeds: [
          embed
        ]})
      }
      if(!data || data.length == 0) return message.reply({content: "<:M_x:933261310588760115> **This User has no Quotes in this Server yet!**"})
      var datas = data.sort((a,b)=> b?.at - a.at).map((data, index) => 
        `\` ${index}. \` By: <@${data.by}> | At: \`${moment(data.at).format("DD/MM/YYYY HH:mm")}\` \n> ${String(data.text).length > 80 ? String(data.text).substring(0, 75) + " ..." : String(data.text)}\n`
        );
      swap_pages(client, message, datas, `Latest Quotes of **\`${user.tag}\`** in **\`${message.guild.name}\`**\nFor more details type:\n> \`${prefix}latestquotes ${user.id} [ID]\``);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by BEAST AMPLIFIER#1334 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
