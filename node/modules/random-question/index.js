'use strict';

const QUESTIONS = require('../../../content/questions/questions.json');

module.exports = function RandomPic({ discord }) {

    const activeQuestionByChannelId = {};

    discord.on('message', message => {
        if (message.author.id === discord.user.id) {
            return
        }
        const activeQuestion = activeQuestionByChannelId[message.channel.id];
        if (activeQuestion) {
            if (checkAnswer(activeQuestion, message)) {
                message.channel.send('да');
                if (activeQuestion.award) {
                    message.channel.send(`бот, ${activeQuestion.award} нефти <@${message.author.id}>`);
                }
            } else {
                message.channel.send('не');
            }
            delete activeQuestionByChannelId[message.channel.id];
        } else {
            const content = message.content.toLowerCase();
            if (content.indexOf('бот') >= 0 && content.indexOf('вопрос') >= 0) {
                const i = getRandomInt(0, QUESTIONS.length - 1);
                const question = QUESTIONS[i];
                activeQuestionByChannelId[message.channel.id] = question;
                message.channel.send(question.message);
            }
        }
    });

    function checkAnswer(question, message) {
        if (question.answer === message.content.toLowerCase()) {
            return true
        }
        return false
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

};
