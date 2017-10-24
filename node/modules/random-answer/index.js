'use strict';

module.exports = function RandomAnswer({ discord }) {

    discord.on('message', message => {
        const content = message.content.toLowerCase();
        if (content.indexOf('бот') >= 0 && (content.indexOf('?') >= 0 || content.indexOf('ответь') >= 0)) {
            handle8ball(message);
        }
    });

    const answers = [
        { message: "Не сейчас"},
        { message: "Не делай этого"},
        { message: "Никаких сомнений"},
        { message: "Ты шутишь?"},
        { message: "Да, но позднее"},
        { message: "Думаю, не стоит"},
        { message: "Не надейся на это"},
        { message: "Ни в коем случае"},
        { message: "Это неплохо"},
        { message: "Кто знает?"},
        { message: "Туманный ответ, попробуй еще"},
        { message: "Я не уверен"},
        { message: "Я думаю, хорошо"},
        { message: "Забудь об этом"},
        { message: "Это возможно"},
        { message: "Определенно — да"},
        { message: "Быть может"},
        { message: "Слишком рано"},
        { message: "Конечно, да"},
        { message: "Да"},
        { message: "Даже не думай"},
        { message: "Лучше Вам пока этого не знать"},
        { message: "По моим данным — «нет»"},
        { message: "Перспективы не очень хорошие"},
        { message: "Весьма сомнительно"},
        { message: "Mada Mada"},
    ];

    function handle8ball(message) {
        const min = 0;
        const max = answers.length-1;
        const i = getRandomInt(min, max);
        const answer = answers[i];
        message.channel.send(answer.message);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

};
