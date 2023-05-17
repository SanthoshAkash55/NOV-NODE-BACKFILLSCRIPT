const TwinTalk = require("./TwinTalkAPI");


async function CreateGroupByQuery(tagGroupName, PIQuery) {
  
const defaultTagGroupName = "EMD_F3_Real_Time_All_Async";
const defaultPIQuery = "EMD-FT-F3_26_*";

try{
  const response = await TwinTalk.CreateGroupByQuery(tagGroupName, PIQuery);
  return response;
}
catch(error){
  console.log(error)
}
}

module.exports = {
  CreateGroupByQuery
};
