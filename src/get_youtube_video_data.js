const https = require('https');
const R = require('ramda');
const formatYoutubeDurationToSeconds = require('./format_youtuve_duration_to_seconds');
const getYoutubeVideoId = require('./get_youtube_video_id');
const { key } = require('./cloud_credentials.json');

function getYoutubeVideoDataPromise(url) {
  return new Promise((resolve, reject) => {
    let data = '';
    const id = getYoutubeVideoId(url);
    https.get(
      `https://www.googleapis.com/youtube/v3/videos?key=${key}&part=contentDetails,snippet&id=${id}`,
      (res) => {
        res.on('data', (d) => {
          data += d;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(data);
          const duration = R.path(['items', '0', 'contentDetails', 'duration'], parsedData);
          const title = R.path(['items', '0', 'snippet', 'title'], parsedData);
          resolve({
            duration: formatYoutubeDurationToSeconds(duration),
            title,
          });
        });
        res.on('error', e => reject(e));
      },
    );
  });
}

module.exports = function getYoutubeVideoData(url) {
  return getYoutubeVideoDataPromise(url);
};
