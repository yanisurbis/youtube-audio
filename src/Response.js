const R = require('ramda');

module.exports = class Reponse {
  // telegraph ctx - http://telegraf.js.org/#/?id=context
  constructor(ctx) {
    this.ctx = ctx;
    this.messageId = R.path(['update', 'message', 'message_id'], this.ctx);
    this.chatId = R.path(['update', 'message', 'chat', 'id'], this.ctx);
  }

  sample() {
    console.log(this.ctx);
    console.log(R.path(['update', 'message'], this.ctx));
    this.messageId = R.path(['update', 'message', 'message_id'], this.ctx);
    this.chatId = R.path(['update', 'message', 'chat', 'id'], this.ctx);
    console.log({
      messageId: this.messageId,
      chatId: this.chatId,
    });
  }

  reply(txt) {
    this.ctx.replyWithMarkdown(txt);
  }

  startSendingConversionStats() {
    let secondsSinceStart = 5;

    this.ctx.replyWithMarkdown('Start converting');

    this.interval = setInterval(() => {
      this.ctx.replyWithMarkdown(`Converting at least for *${secondsSinceStart}* seconds`);
      secondsSinceStart += 5;
    }, secondsSinceStart * 1000);
  }

  stopSendingConversionStats() {
    clearInterval(this.interval);
  }

  sendError(error) {
    console.log(error);
    this.ctx.reply('Some error happened :(');
  }
};
