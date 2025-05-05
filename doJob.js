const cron = require('cron');
const https = require('https');

//https://crontab.guru/#*/10_*_*_*_*

const doJob = new cron.CronJob('*/10 * * * *', function(){
    console.log('not sleep');

    const url = "https://lagg333673034-my-test-app.netlify.app";
    https
        .get(url,(res)=>{
            if(res.statusCode === 200) {
                console.log('ok :)');
            }else{
                console.error('failed :(');
            }
        })
        .on('error',(err)=>{
            console.error('error');
        });

});

module.exports = doJob;