'use strict';

const request = require('request-promise');
const RichEmbed = require("discord.js").RichEmbed;

module.exports = function Stats({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('/stats') === 0) {
            handleStatsCommand(message);
            return
        }
    });

    function handleStatsCommand(message) {
        const param= message.content.replace('/stats', '').trim();
        if (!param || param.indexOf('#') === -1) {
            message.reply('необходимо указать BattleTag, например /stats oxiggy#2286');
        } else {
            const battleTag= param.split('#');
            if (!battleTag[0] || !battleTag[1]) {
                message.reply('неверный формат BattleTag');
            } else {
                request({
                    uri: `http://api.overwatchy.com/profile/pc/eu/${battleTag[0]}-${battleTag[1]}`,
                    json: true
                })
                    .then(function (data) {
						let content = new RichEmbed();
                        content.setAuthor(message.member.nickname === null ? message.author.username : message.member.nickname, message.author.avatarURL);
                        content.setTitle(data.username + ' (' + data.level + ' уровень)');
                        content.addField("Рейтинг", `
						— Танки: ${data.competitive.tank.rank === null ? 'Не откалиброван' : data.competitive.tank.rank}
						— ДД: ${data.competitive.damage.rank === null ? 'Не откалиброван' : data.competitive.damage.rank}
						— Сапорты: ${data.competitive.support.rank === null ? 'Не откалиброван' : data.competitive.support.rank}
						`, false);
                        content.addField("Быстрые игры", `— побед: ${data.games.quickplay.won}\n— потрачено: ${data.playtime.quickplay}`, false);
                        content.addField("Текущий сезон ранкеда:", `
                        — процент побед: ${(data.games.competitive.won / (data.games.competitive.lost + data.games.competitive.won) * 100).toFixed(1)}%
                        — побед: ${data.games.competitive.won}
						— поражений: ${data.games.competitive.lost}
						— ничьих: ${data.games.competitive.draw}
						— потрачено: ${data.playtime.competitive}
                        `, false);
                        content.addField(`Ссылка`, `https://www.overbuff.com/players/pc/${battleTag[0]}-${battleTag[1]}`, false);
                        content.setColor('#d6740b');
                        content.setThumbnail(data.portrait);
                        message.channel.send(content);
                    })
                    .catch(function () {
                        message.reply('что-то пошло не так');
                    })
                ;
            }
        }
    }

};
