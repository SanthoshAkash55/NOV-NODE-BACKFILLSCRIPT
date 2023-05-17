const aws = require('aws-sdk');
const s3 = new aws.S3({ 
     accessKeyId: process.env.ACCESSKEY_ID,
     secretAccessKey: process.env.SECRETACESS_KEY, 
      apiVersion: process.env.APIVERSION
    });

module.exports.S3CSVdata = async(bucket,key)=>{
    return new Promise(async(resolve, reject)=>{
        const results = [];
        const params = {
            Bucket: bucket,
            Key: key    
        };
        const s3Stream = s3.getObject(params).createReadStream()
        require('fast-csv').parseStream(s3Stream)
        .on("error", reject)
        .on('data', (data) => {
            results.push({tagName:data[0], startDate: data[1], endDate: data[2]})
        })
        .on('end', () => {
            resolve(results)
        });
    })
}

const days = (date_1, date_2) =>{
    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    let finalDays = TotalDays * -1 ;
    return finalDays;
}

module.exports.storeLogs = async(input) => {
    try{
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    var content='';
    var getParams = {
        Bucket: process.env.LOGS_BUCKETNAME, 
        Key: `${day}.log`
    };
    let {Body} = await s3.getObject(getParams).promise();
    content = Body.toString()
    if(content){
        let date1 = content.split(' ')[0];
        date1 = date1.split('\n')[1]
        date1 = date1.split('\t')[0]
        let date_1 = new Date(date1)
        let date_2 = new Date() 
        content = days(date_1, date_2)>1 ? '' : content
        let dateIso = Math.floor(new Date().getTime() * 1000)
    }
    content = content + '\n' + new Date().toISOString() + '\t' + input;
    var putParams = {
        Body: content,
        Bucket: process.env.LOGS_BUCKETNAME, 
        Key: `${day}.log`
     };
    await s3.putObject(putParams).promise();
    }
    catch(err){
        if (err.code === 'NoSuchKey') {
           // If S3 object does not exist, create a new object with the current day name as key
           const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
           const today = new Date();
           const dayName = weekday[today.getDay()]; // Get current day name
           const key = `${dayName}.log`;
          content = content + '\n' + new Date().toISOString() + '\t' + input;
           const putParams = {
               Body: content,
               Bucket: process.env.LOGS_BUCKETNAME,
               Key: key
           };
           const putData = await s3.putObject(putParams).promise();
           return putData;
       } else {
           console.log(err, err.stack);
           throw err;
       }
    }
}