export const dateFormat = (timestamp: string) => {
  const time: Date = new Date(timestamp);
  const year: string = time.getFullYear().toString();
  let month: string = (time.getMonth() + 1).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  let date: string = time.getDate().toString();
  if (date.length === 1) {
    date = "0" + date;
  }
  const day = time.getDay();
  let _dayKr = "";
  switch (day) {
    case 0:
      _dayKr = "일";
      break;
    case 1:
      _dayKr = "월";
      break;
    case 2:
      _dayKr = "화";
      break;
    case 3:
      _dayKr = "수";
      break;
    case 4:
      _dayKr = "목";
      break;
    case 5:
      _dayKr = "금";
      break;
    case 6:
      _dayKr = "토";
      break;
  }

  return `${year}-${month}-${date}`;
  // ex) 2012.01.01
};
