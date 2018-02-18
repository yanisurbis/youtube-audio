module.exports = function YTDurationToSeconds(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  match = match.slice(1).map((x) => {
    if (x != null) {
      return x.replace(/\D/, '');
    }
    return ['0', '0', '0'];
  });

  const hours = parseInt(match[0], 10) || 0;
  const minutes = parseInt(match[1], 10) || 0;
  const seconds = parseInt(match[2], 10) || 0;

  // prettier-ignore
  return (hours * 3600) + (minutes * 60) + seconds;
};
