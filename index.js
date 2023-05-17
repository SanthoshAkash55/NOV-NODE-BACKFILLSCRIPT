const { v4: uuidv4 } = require('uuid');
const TwinTalk = require("./TwinTalkAPI");
const {S3CSVdata, storeLogs} = require('helper') 
const crypto = require('crypto');


exports.handler = async (event, context) => {
 
    try{
         let log = []
      const data  = await S3CSVdata(process.env.BUCKETNAME,process.env.KEY)
          data.shift();
          const hash = crypto.createHash('md5').update(JSON.stringify(data.length)).digest('hex')
            await storeLogs(`${hash} entire tagnames data: ${data.length}`)
    
        const sortedData = data.sort(function(a,b){
          return new Date(b.startDate) - new Date(a.startDate);
        });
         const finalarr = {};
         sortedData.forEach((b) => {
          const datee = new Date(b.endDate).toDateString();
          if (finalarr[datee]) finalarr[datee].push(b);
          else finalarr[datee] = [b]
         });
          const keys = Object.keys(finalarr);
         let updatedGroup = {}
        for(let i in finalarr ){
            let subchunk = []
            while(finalarr[i].length>0){
                subchunk.push(finalarr[i].splice(0,process.env.sizeOfGroup))
            }
            for(let j in subchunk){
                updatedGroup[i+'-'+j] = subchunk[j]
            }
        }

      let dateArray = Object.keys(updatedGroup)
        let chunk = []
        while (dateArray.length > 0) {
            chunk.push(dateArray.splice(0,process.env.sizeOfChunk))
        }
        let result = []
          for( let i in chunk){
            let response = await Promise.all(chunk[i].map(async (record) => {
            const Finalvalue = updatedGroup[record];
            const tagNames = Finalvalue.map(item => item.tagName);
            const StartDate = Finalvalue[0].startDate;
            const EndDate = Finalvalue[0].endDate;
            const groupId = uuidv4();
            const shortUuid = groupId.split('-')[0];
            const groupName = `Group-${shortUuid}`;
            const hashData = `${groupName} ${StartDate} ${EndDate}`;
            const hash = crypto.createHash('md5').update(hashData).digest('hex');
            let creatGroupResponse = await  TwinTalk.CreateGroupByQuery(groupName,tagNames);
            await storeLogs(`${hash}  group created as ${groupName}`)
            await storeLogs(`${hash}  created group data : ${JSON.stringify(creatGroupResponse)}`)
            await storeLogs(`${hash}  no of tagnames successfully uploaded in  ${groupName} : ${JSON.stringify(creatGroupResponse.registered)}`)
            let getRecordResponse = await TwinTalk.GetRecordedVals(groupName, StartDate, EndDate,'','S3',process.env.LOGS_BUCKETNAME,'workshopdata/Node/$DATEDIR_SellableVolume_MostRecent_$SEC_addon','rowathena',`{"Method" : "recent", "CalcDate": "$DATE" , "Frequency": "one time", "Source":"TT Pi (BPX): $GROUPNAME"}`);
            await storeLogs(`${hash}  reading from group ${groupName} and ${JSON.stringify(tagNames)} nsBytesUploaded is ${JSON.stringify(getRecordResponse)}`)
            let deleteResponse = await TwinTalk.DeleteGroupReq(groupName);
            await storeLogs(`${hash}  group deleted as ${groupName}`)
            return({creatGroupResponse,getRecordResponse,deleteResponse});
            }));
            result.push(response) 
          }
        return {
            statusCode: 200,
            body: result
        };
    
    }
    catch (err) {
        console.log(err);
    }
};