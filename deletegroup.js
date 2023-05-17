const TwinTalk = require('./TwinTalkAPI');

const defaultTagGroupName = "EMD_F3_Real_Time_All_Async";

async function DeleteGroupReq(tagGroupName) {
  
  try {
    tagGroupName = tagGroupName || defaultTagGroupName;
    const response = await TwinTalk.DeleteGroupReq(tagGroupName);
    return response
  } catch (error) {
    console.error(error);
  }
}

module.exports = {DeleteGroupReq};
