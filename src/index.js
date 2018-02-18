const Telegraf = require('telegraf');
const ytdl = require('ytdl-core');
const R = require('ramda');

const getYoutubeVideoData = require('./get_youtube_video_data');
const Response = require('./Response');

const { token } = require('./telegram_credentials.json');

const bot = new Telegraf(token);

bot.start(ctx => ctx.reply('Welcome to youtube converter!'));

bot.on('message', async (ctx) => {
  const response = new Response(ctx);
  try {
    response.reply('We got your video');

    const url = R.path(['message', 'text'], ctx);

    const { duration, title } = await getYoutubeVideoData(url);
    response.reply(`We got info about *${title}*`);

    response.startSendingConversionStats();

    ctx
      .replyWithAudio(
        {
          source: ytdl(ctx.message.text, {
            filter: 'audioonly',
          })
            .on('error', (err) => {
              response.sendError(err);
            })
            .on('finish', () => {
              response.stopSendingConversionStats();
            }),
        },
        {
          caption: title,
          title,
          duration,
        },
      )
      .catch((err) => {
        response.sendError(err);
      });
  } catch (err) {
    response.sendError(err);
  }
});
bot.startPolling();
