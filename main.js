const Discord = require("discord.js"),
			client = new Discord.Client(),
			mongo   = require('mongodb').MongoClient;

mongo.connect('mongodb://localhost:27017/online', (error, db) => {
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);

		client.on('guildMemberAdd', member => {
			db.collection('users').insertOne({
				id:   member.user.id,
				tag:  member.user.tag,
				date: new Date().getTime()
			});
		});
		client.on('presenceUpdate', (oldMember, newMember) => {
			db.collection('users').updateOne({id: newMember.user.id}, {$set: {date: new Date().getTime()}});
		});
	});
});

client.login('MzQwNTI0NzgxNjEzMDg4Nzg5.DFzx7A.PQa1q40erT9sSIbS_Srsylg1Djg');
