const Discord = require("discord.js"),
			client  = new Discord.Client(),
			mongo   = require('mongodb').MongoClient,
			cronJob = require('cron').CronJob;

mongo.connect('mongodb://localhost:27017/online', (error, db) => {
	var users = db.collection('users');
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);

		client.on('guildMemberAdd', member => {
			users.insertOne({
				id:   member.user.id,
				tag:  member.user.tag,
				date: new Date().getTime()
			});
		});
		client.on('presenceUpdate', (oldMember, newMember) => {
			users.updateOne({id: newMember.user.id}, {$set: {date: new Date().getTime()}});
		});
	});

	new cronJob({
		cronTime: '0 0 0 * * *',
		onTick: () => {
			let now = new Date().getTime(), nores = [];
			users.find().toArray().forEach(doc => {
				if (now-doc.date > 86400) nores.push(doc.id);
			});
			client.channels.get('336901767226720256').send(`今日の無反応メンバーは <@${nores.join('> <@')}>`);
		}
	});

});

client.login('MzQwNTI0NzgxNjEzMDg4Nzg5.DFzx7A.PQa1q40erT9sSIbS_Srsylg1Djg');
