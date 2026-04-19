const https = require('https');

https.get('https://raw.githubusercontent.com/lsv/fifa-worldcup-2026/master/data.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 404) {
      console.log('GitHub repo data not found');
    } else {
      console.log(data.substring(0, 500));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
