const GitFileDownloader = require('git-file-downloader');

// Passer en série de promises TODO
let dowloads = [
    "csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv",
    "csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv",
    "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
];

let downloadPromises = [];

for (let i in dowloads) {
    downloadPromises.push(new GitFileDownloader({
        provider: 'github',
        repository: 'CSSEGISandData/COVID-19',
        branch: 'master',
        file: dowloads[i],
        output: './data'
    }).run())
};

Promise.all(downloadPromises).then(() => {
    console.log("All sources have been downloaded".success);
}).catch(err => {
    console.log("Error downloading the sources files from Github".error);
    console.log(err);
    console.log('--------------------'.error);
})