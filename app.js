const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const bot = new Discord.Client();
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');
const randomPuppy = require('random-puppy');
const ytdl = require('ytdl-core');
const queue = new Map();
//const ffmpeg = require('ffmpeg');
// const customRoles = {
//     newbie: '779360735959842886',
//     regular: '779360811088478268',
//     trusted: '779360967996997633'
// };

let stats = {};
if(fs.existsSync('stats.json')){
    stats = jsonfile.readFileSync('stats.json');
}

async function run (){
    
    try {
        const subReddits = [`dankmeme`,`meme`,`me_irl`];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const img = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("#FFFFFF")
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);
        return embed;
    }
    catch(err) {
        console.log(err);
    }
}

bot.once("ready", () => {
  console.log("Ready!");
});

bot.once("reconnecting", () => {
  console.log("Reconnecting!");
});

bot.once("disconnect", () => {
  console.log("Disconnect!");
});
/*************************
Bot Ready State
*************************/
bot.on('ready', () => {
    console.log("Bot Ready");
    // bot.user.setActivity("with depression");
    // bot.user.setGame("");

    /*
        Status: 
            'Online', 'dnd', 'idle', 'invisible';
        setGame: 
            'Change the string to whatever you want it to say';
        To set stream - setGame('Hello!', 'URL');
    */
    bot.user.setPresence({
        status: "dnd",
        activity: {
            name: 'Official Mystic Discord',
            type: "WATCHING"
        },
        afk: false
    });
});

/*************************
Bot Main State
*************************/
bot.on('message', function(message){
    if(message.author.id === bot.user.id){
        return;
    }

    //console.log(message.guild.roles);

    if(message.guild.id in stats === false){
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if(message.author.id in guildStats === false){
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

    const userStats = guildStats[message.author.id];
    if(Date.now() - userStats.last_message > 30000){

        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();


        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
        if(userStats.xp >= xpToNextLevel){
            userStats.level++;
            // if(userStats.level >= 50){
            //     message.member.roles.remove(customRoles.regular);
            //     message.member.roles.add(customRoles.trusted);
            //     message.channel.send(message.author.username + ' has been assigned role : Trusted');
            // }
            // else if(userStats.level >= 25){
            //     message.member.roles.remove(customRoles.newbie);
            //     message.member.roles.add(customRoles.regular);
            //     message.channel.send(message.author.username + ' has been assigned role : Regular');
            // }
            // else if(userStats.level >= 10){
            //     message.member.roles.add(customRoles.newbie);
            //     message.channel.send(message.author.username + ' has been assigned role : Newbie');
            // }
            
            userStats.xp = userStats.xp - xpToNextLevel;
            message.channel.send(`<@${message.author.id}> has reached level ${userStats.level}`);
        }
        jsonfile.writeFileSync('stats.json', stats);

        //console.log(message.author.username + ' now has ' + userStats.xp);
        //console.log(xpToNextLevel + ' XP needed for next level.');
        
    }
    const parts = message.content.split(' ');
    //console.log(parts);

    if(parts[0] === '!hello')
        message.reply('hi');
    
    if(parts[0] === '!mystic' && parts[1] === 'ping')
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.reply('Hi There, Admin !! :smile:');
        } else {
            message.reply('Hi There Friend, AI here!!');
        }
    
    //DEBUG COMMAND - BETA
    if(parts[0] === `!mystic` && parts[1] === 'meme')
        message.channel.send(`To be implimented !! :sweat_smile:`);
        // message.channel.send(run());
    
    if(parts[0] === '!mystic' && parts[1] === 'avatar') {
    	const user = message.mentions.users.first();
    	if(user) {
    		const member = message.guild.member(user);
    		if(member){
    			message.reply(user.displayAvatarURL({
	    			format : 'jpg',
	    			dynamic : true,
	    			size : 1024
    			}));
            };	
    	} else {
		message.reply(message.author.displayAvatarURL({
			format : 'jpg',
			dynamic : true,
			size : 1024
		}));
        }
    };
    
    /******************************************
     * Bot Moderation Tools
    ******************************************/
    if(message.member.hasPermission("ADMINISTRATOR")){
    	if(parts[0] === '!mystic' && parts[1] === 'kick'){
    		const user = message.mentions.users.first();
    		if(user) {
    			const member = message.guild.member(user);
    			if(member && member.hasPermission("ADMINISTRATOR")){
    				message.reply(`Member is an Admin, cannot kick him !!`);
    			}
    			else if(member) {
    				member.kick(`Reason : Contact Admin`).then(() => {
    					message.reply(`Successfully kicked ${user.tag}`);
    				}).catch(err => {
    					message.reply('Not able to kick member, error is logged !! Check terminal');
    					console.log(err);
    				});
    			} else {
    				message.reply(`User not present in the server !!`);
    			}
    		} else {
    			message.reply(`User not mentioned, Command Syntax Error -> <prefix> ban <user>`);
    		}
    	}
    	else if(parts[0] === `!mystic` && parts[1] === `ban`){
    		const user = message.mentions.users.first();
    		if(user) {
    			const member = message.guild.member(user);
    			if(member && member.hasPermission("ADMINISTRATOR")){
    				message.reply(`Member is an Admin, cannot ban him !!`);
    			}
    			else if(member) {
    				member.ban({Reason : `Contact Admin`}).then(() => {
    					message.reply(`Successfully banned ${user.tag}`);
    				}).catch(err => {
    					message.reply('Not able to ban member, error is logged !! Check terminal');
    					console.log(err);
    				});
    			} else {
    				message.reply(`User not present in the server !!`);
    			}
    		} else {
    			message.reply(`User not mentioned, Command Syntax Error -> <prefix> kick <user>`);
    		}
    	}
    };
    /******************************************
     * Bot Music Tools
    ******************************************/
    const serverQueue = queue.get(message.guild.id);
    if(parts[0] === '!mystic' && parts[1] === 'play'){
        execute(message, serverQueue, parts);
        return;
    } else if (parts[0] === '!mystic' && parts[1] === 'skip'){
        skip(message, serverQueue, parts);
        return;
    } else if (parts[0] === '!mystic' && parts[1] === 'stop') {
        stop(message, serverQueue, parts);
        return;
    } else {
        return;
    }
});

async function execute(message, serverQueue, parts) {
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel)
        return message.channel.send('You need to be in the voice channel to play music :man_shrugging:');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has(`CONNECT`) || !permissions.has(`SPEAK`)) {
        return message.channel.send(`I need the permission to join and speak in your voice channel!`);
    }

    const songInfo = await ytdl.getInfo(parts[2]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if(!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch(err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue, parts) {
    if(!message.member.voice.channel)
        return message.channel.send('You need to be in the voice channel to play music :man_shrugging:');
    if(!serverQueue)
        return message.channel.send('There is no song that i could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if(!message.member.voice.channel)
        return message.channel.send('You need to be in the voice channel to play music :man_shrugging:');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if(!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on('finish', () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    }).on('error', error => {
        console.log(error);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
//Add Webhooks ------ Mystic Youtube webhook

bot.login('NTE2NTU1NjA0MjI4MDQ2ODY1.W_vF5Q.HDOe2pknXqPBd4trhYwOaH5s-9s');
