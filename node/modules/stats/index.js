'use strict';

const request = require('request-promise');

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
                    uri: `http://ow-api.herokuapp.com/profile/pc/eu/${battleTag[0]}-${battleTag[1]}'`,
                    json: true
                })
                    .then(function (data) {
                        let content= ''
                        content+= '' + data.username + ' (' + data.level + ' уровень, '+ data.competitive.rank +' ранг)\n'
                        content+= '\n'
                        content+= 'Быстрые игры:\n'
                        content+= '— побед: '+ data.games.quickplay.won +'\n'
                        content+= '— потрачено: '+ data.playtime.quickplay +'\n'
                        content+= '\n'
                        content+= 'Текущий сезон ранкеда:\n'
                        content+= '— процент побед: '+ (data.games.competitive.won / (data.games.competitive.lost+data.games.competitive.won) * 100).toFixed(1)  + '% '  +'\n'
                        content+= '— побед: '+ data.games.competitive.won +'\n'
                        content+= '— поражений: '+ data.games.competitive.lost +'\n'
                        content+= '— ничьих: '+ data.games.competitive.draw +'\n'
                        content+= '— потрачено: '+ data.playtime.competitive +'\n'
                        content+= '\n'
                        content+= '\n'
                        content+= 'Ссылка: '+ 'https://www.overbuff.com/players/pc/' + battleTag[0] + '-' + battleTag[1]
                        message.reply(content);
                    })
                    .catch(function () {
                        message.reply('что-то пошло не так');
                    })
                ;
            }
        }
    }

};
