const express = require("express");
const app = express();
const tabletojson = require("tabletojson");

const PORT = 2004;
let bookings;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  next();
});

const getTable = () => {
  tabletojson.convertUrl(
    'https://wiki.cdot.senecacollege.ca/wiki/Meeting_Room_T1042',
    function (tableAsJson) {
      bookings = tableAsJson[0];
    })
};

app.get("/", (req, res) => {
  getTable();
  let today = new Date();
  let filteredTable;
  
  try {
    bookings = bookings.filter(row => {
      let splitDateTime = row["Date and time"].split(' ');
      let date = splitDateTime[0];
      let time = splitDateTime[1];
      date = date.split("-");
      time = time.split("-");
      let startTime = time[0];
      let endTime = time[1];
      let year = Number(date[0]);
      // offset month by 1 because Date object in Javascript is from 0-11
      let month = Number(date[1]) - 1;
      let day = Number(date[2]);
      let bookingDate = new Date(year, month, day);

      return today.getDate() == bookingDate.getDate() && today.getMonth() == bookingDate.getMonth() && today.getFullYear() == bookingDate.getFullYear();
    });

    filteredTable = { rows: bookings };
  } catch (e) {
    console.log(e);
    filteredTable = {rows: []};
  }
  res.json(filteredTable);
});

app.listen(PORT, ()=> {
  console.log(`Running on localhost:${PORT}`);
})
