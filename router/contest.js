const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const router = express.Router();

router.get("/contest", (req, res) => {
  console.log("HELLO FROM CONTEST");
  
  const requestOne = axios.get(`https://www.stopstalk.com/contests`);
  axios
    .all([requestOne])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        // const $ = cheerio.load(responseOne.data);
        // const rows = [];
        // const sel = "#contests-table tbody tr:nth-child(1)";
        // $(sel).each(function (i, e) {
        //   const row = [];
        //   rows.push(row);
        //   $(this)
        //     .find("td")
        //     .each(function (i, e) {
        //       row.push($(this).text().trim());
        //     });
        // });
        console.table(responseOne);
        res.send(req.rootUser);
  res.status(200).send("ubuuu");
      })
    )
    .catch((errors) => {
      console.log(errors);
    });

});

module.exports = router;
