// convert epoch format to date
export const convertEpochToDateIST = (epochTime) => {
    const date = new Date(epochTime);
    const options = { 
      timeZone: 'Asia/Kolkata', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      fractionalSecondDigits: 3 
    };
    const istDate = date.toLocaleString('en-IN', options);
  
    return istDate;
  };