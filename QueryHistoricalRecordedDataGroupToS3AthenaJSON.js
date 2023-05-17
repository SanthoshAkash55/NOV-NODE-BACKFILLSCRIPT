const TwinTalk = require('./TwinTalkAPI');

const defaultTagGroupName = "EMD_F3_Real_Time_All_Async";

async function GetRecordedValsByGroupS3(tagGroupName,startDateTime,EndDateTime) {
  try {
  const fromDateTime = startDateTime
  const toDateTime = EndDateTime
  const kind = ''
  const targetType = 'S3'
  const Bucket_name = process.env.LOGS_BUCKETNAME
  const path = 'workshopdata/Node/$DATEDIR_SellableVolume_MostRecent_$SEC_addon'
  const info2 = 'rowathena'
  const addonToValues = `{"Method" : "recent", "CalcDate": "$DATE" , "Frequency": "one time", "Source":"TT Pi (BPX): $GROUPNAME"}`

  const response = await TwinTalk.GetRecordedVals(tagGroupName, fromDateTime, toDateTime, kind, targetType, Bucket_name, path, info2, addonToValues);
    return response
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  GetRecordedValsByGroupS3
};
