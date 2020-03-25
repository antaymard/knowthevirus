const GitFileDownloader = require('git-file-downloader');

// Passer en série de promises TODO

// Dowload the csv file from Github
var downloader = new GitFileDownloader({
    provider: 'github',
    repository: 'CSSEGISandData/COVID-19',
    branch: 'master',
    file: 'csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
    output: './data'
});

downloader.run()
    .then(() => {
        console.log("File downloaded from Github".success)
    })
    .catch(err => {
        console.log('Error downloading data from Github'.error)
        console.error(err);
        // process.exitCode = 1;
    });