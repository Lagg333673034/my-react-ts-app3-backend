const cron = require('cron');
const https = require('https');

//'* */1 * * * *'  //every seconds
//'*/1 * * * *'  //every minutes
//'*/14 * * * *'  //every minutes

const job = new cron.CronJob('*/14 * * * *', function(){
    console.log('not sleep');

    const url = "https://todo-server-rijd.onrender.com/api/project";
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

module.exports = job;