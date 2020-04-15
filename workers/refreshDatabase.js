const { DownloaderHelper } = require('node-downloader-helper');
const path = require('path');







// run the worker
exports.run = function () {
    // Download full_data into ./data
    const d1 = new DownloaderHelper('https://covid.ourworldindata.org/data/ecdc/full_data.csv', './data', { override: true });

    d1.on('end', () => console.log('Download Completed'.success));
    d1.on('error', (err) => console.log('Error downloading w/ downloadhelper : %s'.error, err));

    d1.start();

    // When the download is completed
    d1.on('end', () => {
        console.log("Download completed".success)
        // Launch the convert function
        require('./convert.js');
    })
    console.log('Running')
}