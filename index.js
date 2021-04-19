const discord = require("discord.js");
const botConfig = require("./botconfig.json"); 

const client = new discord.Client(); 
client.login(process.env.token);

client.on("ready", async () => {

 console.log(`${client.user.username} is online.`); 
 client.user.setActivity("Knol kanker", {type: "Playing"});

});

client.on("message", async message =>{
    
    if(message.author.bot) return; 

    if (message.channel.type == "dm") return; 

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if(command === `${prefix}hallo`){
        return message.channel.send("Hallo, ik ben Vex. de Bot van deze server");
    }

    if(command === `${prefix}info`){
        
       var botEmbed = new discord.MessageEmbed()
         .setTitle("Royale Vex Info")
         .setDescription("All information")
         .setColor("#f0fc0a")
         .addField("Bot Name", client.user.username)
         .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
         .setFooter("Royale vex")
         .setTimestamp();
        
            
         return message.channel.send(botEmbed); 
    }


    if(command === `${prefix}playerinfo`) {
        
        var botEmbed = new discord.MessageEmbed()
          .setTitle("Royale Vex Info")
          .setDescription("All information about the server and you!")
          .setColor("#f0fc0a")
          .addField("Bot Name", client.user.username)
          .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
          .addFields(
              {name: "You joined the server on: ", value: message.member.joinedAt},
              {name: "Total Members", value:message.guild.memberCount},
          );
         
             
          return message.channel.send(botEmbed); 
    }

    if(command === `${prefix}kick`){

        //  Reasons hier

        var args  = message.content.slice(prefix.length).split(/ +/);



        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, you can't use this command dumb ass");

        if(!message.guild.me.hasPermission("KICK_MEMBERS"))return message.reply("No Perms");

        if(!args[1]) return message.reply("🚨 No Username Detected.");

        if(!args[2]) return message.reply("🚨 No Reason Detected.");

        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1])); 

        var reason = args.slice(2).join(" "); 

        if(!kickUser) return message.reply("⛔ User not found");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please React Within 30 Seconds")
            .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
            .setDescription(`Do you want to kick ${kickUser}?`); 
        
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Kicked: ** ${kickUser} (${kickUser.id})
            **Kicked By:** ${message.author}
            **Reasons: ** ${reason}`);

         message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅"){

                msg.delete();

                kickUser.kick(reason).catch(err =>{
                    if (err) return message.reply("🚫 OOPS Something went wrong");
                });

                message.channel.send(embed);

            }else if(emoji === "❌"){

                msg.delete();

                message.reply("Kick cancelled").then(m => m.delete(5000));

            }

         })  

    }

    if(command === `${prefix}ban`){

        //  Reasons hier

        var args  = message.content.slice(prefix.length).split(/ +/);



        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry, you can't use this command dumb ass");

        if(!message.guild.me.hasPermission("BAN_MEMBERS"))return message.reply("No Perms");

        if(!args[1]) return message.reply("🚨 No Username Detected.");

        if(!args[2]) return message.reply("🚨 No Reason Detected.");

        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1])); 

        var reason = args.slice(2).join(" "); 

        if(!banUser) return message.reply("⛔ User not found");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please React Within 30 Seconds")
            .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
            .setDescription(`Do you want to ban ${banUser}?`); 
        
        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail("https://cdn.craftingstore.net/rPPmDHlLQ1/07f2c6224423c478ffb0b381a53fed08/c7y3hmnhksyzvg1ttum2.jpg")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Banned: ** ${banUser} (${banUser.id})
            **Banned by:** ${message.author}
            **Reasons: ** ${reason}`);

         message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅"){

                msg.delete();

                banUser.ban({reason}).catch(err =>{
                    if(err) return message.reply("🚫 OOPS Something went wrong");
                });

                message.channel.send(embed);

            }else if(emoji === "❌"){

                msg.delete();

                message.reply("ban cancelled").then(m => m.delete(5000));

            }

         })  

    }

});




async function promptMessage(message, author, time, reactions){

    time *= 1000;

    for(const reaction of reactions){
        await message.react(reaction);
    }

    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, {max:1, time: time}).then(collected => collected.first() && collected.first().emoji.name);

}