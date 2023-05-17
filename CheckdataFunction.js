
exports.checkParamsVals = async(checkObj)=>{
  
  for (let key in checkObj ){
    
      if(!checkObj[key]){
          return {message:`${key} is required and must be a correct format`}
      }
      if (key === 'fromDateTime') {
          if (!Date.parse(checkObj[key])) {
            return { message: `${key} must be a valid ISO 8601 timestamp` };
          }
        }
        if (key === 'toDateTime') {
           if (!Date.parse(checkObj[key])) {
            return { message: `${key} must be a valid ISO 8601 timestamp` };
          }
        }
        if (key === 'timeSpan') {
          const regex = /^\d{2}:\d{2}:\d{2}$/;
          if (!regex.test(checkObj[key])) {
            return { message: `${key} must be a string in the format of "24:00:00"` };
          }
      }
      if (key === 'addonToValues') {
          try {
            JSON.parse(checkObj[key]);
          } catch (err) {
            return { message: `${key} must be a valid JSON object` };
          }
        }
  }
  return {message:`true`}

}