var Discord = require("discord.js");

// Get the OAuth2 token
var AuthDetails = require("./auth.json");
var bot = new Discord.Client();

// Load the Rules Of The Internet
var roti = require("./roti.json");

var http = require('http');

// Discord Bot
var nbMsgRegex = 10;
var regexScript = '/home/derpy/src/minizarbot/regexsandbox.pl';
const exec = require('child_process').spawnSync;

const fs = require('fs');

bot.on("ready", function () {
	console.log("Ready!");
});

bot.on("disconnected", function () {
	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error
});

bot.on("message", function (msg) {
	/* If the channel contains bot and doesn't contain nobot */
	if (msg.channel.isPrivate || (msg.channel.name.search("nobot") == -1 && msg.author.username !== 'Minizarbot')) {
		var cleanMsg = msg.content.trim();
		if (cleanMsg === '!ping') {
			bot.sendMessage(msg.channel, "Pong!");
		} else if (cleanMsg === '!miniomgstop') {
		   console.log('Killed by ' + msg.author.username + ' at ' + new Date());
		   process.exit(0);
		} else if (cleanMsg === '!quote') {
			var options = {
				host: 'www.quotationspage.com',
				path: '/random.php3'
			};

			callback = function(response) {
				var str = '';

				//another chunk of data has been recieved, so append it to `str`
				response.on('data', function (chunk) {
					str += chunk;
				});

				//the whole response has been recieved, so we just print it out here
				response.on('end', function () {
					var reg = /<dt class="quote"><a.*?>(.*?)</gm;
					var match = reg.exec(str);
					bot.sendMessage(msg.channel, "*" + match[1] + "*", {tts:true});
				});
			}

			http.request(options, callback).end();
			
		} else if (cleanMsg.search(/^s\/(?:(?:[^\\\/]|\\.)*\/){2}[dragoncumpixels]*$/) != -1) {
			bot.getChannelLogs(msg.channel, nbMsgRegex, {before: msg}, function(error, messages) {
				var i = 0;
				while (i < nbMsgRegex) {
					var res = exec("/usr/bin/perl", ["-CSAD", regexScript, cleanMsg, messages[i].content]);
					if (res.signal) { /* If the program received a signal (like time limit) */
						return;
					}
					if (res.status == 0) { /* If the regex matched */
						if (messages[i].author == bot.user) {
							bot.updateMessage(messages[i], res.stdout);
						} else {
							bot.sendMessage(msg.channel, res.stdout);
						}
						return;
					}
					i++;
				}
			});
		} else if (cleanMsg === "!fish") {
			bot.sendMessage(msg.channel, "><>°", function(error, message) {
				if (error) {
					return;
				}

				setTimeout(fish.bind(null, 1, message), 1000);
			});

		} else if (cleanMsg === "!caramel") {
			bot.sendMessage(msg.channel, "\\o\\", function(error, message) {
				if (error) {
					return;
				}

				setTimeout(caramel.bind(null, 1, message), 1000);
			});

		} else if (cleanMsg.startsWith("!roti")) {
			var params = cleanMsg.split(" ");
			var number;
			if (params.length > 1) {
				number = parseInt(params[1]) - 1;
				if (number < 0 || number >= roti.length) {
					number = Math.floor((Math.random() * roti.length)); 
				}
			} else {
				number = Math.floor((Math.random() * roti.length)); 
			}
			bot.sendMessage(msg.channel, roti[number]);
		}
	}
});

function fish(i, message) {
	var msg = "><>°";
	if (i < 10) {
		for (var j = 0; j < i; j++) {
			msg = "\\\~" + msg;
		}
		bot.updateMessage(message, msg);
		setTimeout(fish.bind(null, i + 1, message), 1000);
	}
}

function caramel(i, message) {
	var msg = ["\\o\\", "|o|", "/o/", "|o|"];
	if (i < 10) {
		msg = msg[i % 4];
		bot.updateMessage(message, msg);
		setTimeout(caramel.bind(null, i + 1, message), 1000);
	}
}

bot.loginWithToken(AuthDetails.token);
