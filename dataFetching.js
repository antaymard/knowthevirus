const GitFileDownloader = require('git-file-downloader');
var schedule = require('node-schedule');

let deathGlobal = [];


// Passer en série de promises TODO
let dowloads = [
    {
        name: "recoveredGlobal",
        fileName: "time_series_covid19_recovered_global.csv",
        path: "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
    },
    {
        name: 'confirmedGlobal',
        fileName: "time_series_covid19_confirmed_global.csv",
        path: "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    },
    {
        name: 'deathGlobal',
        fileName: "/time_series_covid19_deaths_global.csv",
        path: "csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
    }
];

let downloadPromises = [];

for (let i in dowloads) {
    downloadPromises.push(new GitFileDownloader({
        provider: 'github',
        repository: 'CSSEGISandData/COVID-19',
        branch: 'master',
        file: dowloads[i].path,
        output: './data'
    }).run().catch())
};

const downlLoadSources = () => {
    Promise.all(downloadPromises).then(() => {
        console.log("All sources have been downloaded at %s".success, new Date());
    }).catch(err => {
        console.log("Error downloading the sources files from Github".error);
        console.log(err);
        console.log('--------------------'.error);
    })
}

// Download the files on launch
downlLoadSources();

// Run every 3 hours
schedule.scheduleJob('* * /3 * * *', function (firedDate) {
    console.log('DL worker has been triggered at %s'.info, firedDate);
    downlLoadSources();
});
