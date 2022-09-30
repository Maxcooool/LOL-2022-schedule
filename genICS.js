const fs = require("fs");
const cheerio = require("cheerio");

const dayjs = require("dayjs");

const url = "./index.html";
const dataStr = fs.readFileSync(url, "utf-8");

let now = dayjs();
console.log(now);

let dataList = [];

// 获取 html 中的赛程
function getTimeFromHTML() {
  var $ = cheerio.load(dataStr);
  let list = $(".m-first-part ul li");
  list.each((index, item) => {
    const teamA = $(item).find(".gamelist-team-a a").text();
    const teamB = $(item).find(".gamelist-team-b a").text();
    const date = $(item).find(".gamelist-item-topbar .span2").text();
    const time = $(item).find(".gamelist-item-topbar .span3").text();

    if (teamA && teamB) {
      let obj = {
        title: `${$(item).find(".gamelist-team-a a").text()} - ${$(item)
          .find(".gamelist-team-b a")
          .text()}`,
        startTime: transTime(date, time),
        endTime: transTime(date, time),
      };
      dataList.push(obj);
    }

    console.log(dataList, "xxx");
  });

  // 时间处理  20220910T120000Z
  function transTime(date, time) {
    let dateArray = date.split("-");
    let month = dateArray[0];
    let day = dateArray[1];
    let timeArray = time.split(":");
    let hour = timeArray[0];
    let min = timeArray[1];
    let realTime = dayjs(`2022-${month}-${day} ${hour}:${min}:00`)
      .subtract(8, "hour")
      .format("YYYYMMDDTHHmm00");
    let res = `${realTime}Z`;
    return res;
  }
}

// const scheduleList = [
//   {
//     title: "FNC - DFM",
//     startTime: "20220930T200000Z",
//     endTime: "20220930T200000Z",
//   },
//   {
//     title: "EG - LLL",
//     startTime: "20220930T210000Z",
//     endTime: "20220930T210000Z",
//   },
//   {
//     title: "SGB - ISG",
//     startTime: "20220930T220000Z",
//     endTime: "20220930T220000Z",
//   },
//   {
//     title: "DFM - CHF",
//     startTime: "20220930T230000Z",
//     endTime: "20220930T230000Z",
//   },
//   {
//     title: "EG - BYG",
//     startTime: "20221001T000000Z",
//     endTime: "20221001T000000Z",
//   },
//   {
//     title: "DRX - SGB",
//     startTime: "20221001T010000Z",
//     endTime: "20221001T010000Z",
//   },
//   {
//     title: "MAD - RNG",
//     startTime: "20221001T020000Z",
//     endTime: "20221001T020000Z",
//   },
// ];

function writeTemplate() {
  // 写入文件头部
  const headerString = `BEGIN:VCALENDAR\nMETHOD:PUBLISH\nVERSION:2.0\nX-WR-CALNAME:MaxCool 赛程订阅\nX-WR-CALDESC:2022全球LOL总决赛赛程\nX-APPLE-CALENDAR-COLOR:#fe7300\nX-WR-TIMEZONE:Asia/Shanghai\nCALSCALE:GREGORIAN\n\n`;
  fs.writeFileSync("maxcool.ics", headerString, {
    encoding: "utf8",
    flag: "a", // 追加写入同一个文件
  });

  dataList.forEach((item) => {
    ICSGenFn(item);
  });

  // 写入文件尾部
  const footerString = `END:VCALENDAR`;
  fs.writeFileSync("maxcool.ics", footerString, {
    encoding: "utf8",
    flag: "a", // 追加写入同一个文件
  });
}

//写入文件（文件不存在就创建）
function ICSGenFn(item) {
  let textString = `BEGIN:VEVENT\nTRANSP:TRANSPARENT\nX-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC\nSUMMARY:${item.title}\nDTSTART;VALUE=DATE:${item.startTime}\nDTEND;VALUE=DATE:${item.endTime}\nSEQUENCE:1\nEND:VEVENT\n\n`;

  // 同步写入
  fs.writeFileSync("maxcool.ics", textString, {
    encoding: "utf8",
    flag: "a", // 追加写入同一个文件
  });
}

function init() {
  getTimeFromHTML();
  writeTemplate();
}

init();
