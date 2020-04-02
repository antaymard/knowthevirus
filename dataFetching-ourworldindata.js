const { DownloaderHelper } = require('node-downloader-helper');

// Download full_data into ./data
const d1 = new DownloaderHelper('https://covid.ourworldindata.org/data/ecdc/full_data.csv', './data');

d1.on('end', () => console.log('Download Completed'.success));
d1.on('error', (err) => console.log('Error downloading w/ downloadhelper : %s'.error, err));

d1.start();

