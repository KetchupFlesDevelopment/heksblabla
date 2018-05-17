const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log('Heks bot has started cyka blyat!'); 
  client.user.setActivity(`with my virtual dick!`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Look at me, I am a beautifull creature!`);
  }
  
  if(command === "say") {
    if(!message.member.roles.some(r=>["dis perms"].includes(r.name)) )
    return message.reply("You need more rights to use this command!");

    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["dis perms", "Admin", "Moderator"].includes(r.name)) )
      return message.reply("You need more rights to use this command!");
    
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
      let serverembed = new Discord.RichEmbed()
      .setColor("#f44242")
      .addField(`${member.user.tag}`, `has been kicked!\n** **`)
      .addField("Banned by:", `** **${message.author.tag}\n** **`)
      .addField("Reason:", `** **${reason}`)
      message.channel.send(serverembed);

  }
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["Admin", "dis perms"].includes(r.name)) )
      return message.reply("You need more rights to use this command!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    let serverembed = new Discord.RichEmbed()
    .setColor("#f44242")
    .addField(`${member.user.tag}`, `has been banned!\n** **`)
    .addField("Banned by:", `** **${message.author.tag}\n** **`)
    .addField("Reason:", `** **${reason}`)
    message.channel.send(serverembed);
  }
  
  if(command === "sethacker") {
    if(!message.member.roles.some(r=>["Member+"].includes(r.name)) )
      return message.delete().catch(O_o=>{});

    const rhekser = message.guild.roles.find('name', 'Hekser');
    const rmember = message.guild.roles.find('name', 'Member');
    const member = message.member;

    message.author.send('You are now in **hacker mode**! You can get out of this mode with !!setmember.')
    message.author.send('Giving this command to other players will result in a ban for you and all the user you have sent the command to!')
    message.delete().catch(O_o=>{});

    member.addRole(rhekser)
    member.removeRole(rmember)

    let botlog = message.guild.channels.find(`name`, "bot-log");

    if(!botlog) return;
    let serverembed = new Discord.RichEmbed()
    .setColor("#f4b942")
    .setThumbnail("https://cdn.pixabay.com/photo/2013/07/12/18/04/caution-152926_960_720.png")
    .addField(`Bot-log | Criteria: **YELLOW**`, '** **')
    .addField(`${message.author.tag}`, " tried to use the **!!sethacker** command!")
    botlog.send(serverembed);
  }

  if(command === "setmember") {
    const rhekser = message.guild.roles.find('name', 'Hekser');
    const rmember = message.guild.roles.find('name', 'Member');
    const member = message.member;

    if(!message.member.roles.some(r=>["Member+"].includes(r.name)) )
      return message.delete().catch(O_o=>{});

    message.author.send('You are now in **member mode**! You can get back to hacker mode with !!sethacker.')
    message.delete().catch(O_o=>{});

    member.addRole(rmember)
    member.removeRole(rhekser)

    let botlog = message.guild.channels.find(`name`, "bot-log");

    if(!botlog) return;
    let serverembed = new Discord.RichEmbed()
    .setColor("#f4b942")
    .setThumbnail("https://cdn.pixabay.com/photo/2013/07/12/18/04/caution-152926_960_720.png")
    .addField(`Bot-log | Criteria: **YELLOW**`, '** **')
    .addField(`${message.author.tag}`, " tried to use the **!!setmember** command!")
    botlog.send(serverembed);
  }

  if(command === "help") {
    let serverembed = new Discord.RichEmbed()
    .setColor("#f44242")
    .addField("Heks Bot | Help page", "All the commands are listed below!\n** **")
    .addField("Information commands", "!!ping - ping pong!\n** **")
    .addField("Staff commands", "!!kick @user <reason> - Kick those naughty users!\n!!ban @user <reason> - Ban those naughty users!")
    .setFooter("Heks by @KetchupFles | DEV#6080, All rights reserved!");

    message.author.send(serverembed);
  }
});

client.on('guildMemberAdd', member => {
  let welcome = member.guild.channels.find(`name`, "welcome");

  let memberavatar = member.user.avatarURL
  let welcomeembed = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setThumbnail(memberavatar)
  .addField(':white_check_mark: | Welcome, ', `${member}`)
  .addField(`I hope you'll have a great time here! `, `** **`)
  .setFooter('Read !!rules for a better experience!')

  if(!welcome) return;
  welcome.send(welcomeembed);

  var role = member.guild.roles.find('name', 'Member');

  member.addRole(role)
});

client.login(config.token);