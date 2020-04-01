const { DownloaderHelper } = require('node-downloader-helper')

const d1 = new DownloaderHelper('https://covid.ourworldindata.org/data/ecdc/full_data.csv', './data')

d1.on('end', () => console.log('Download Completed'))

d1.start()