const express = require("express");
const { countDocuments } = require("../models/usermodel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
// const solved = require("../web-scrapping/codechef-ki-api.js");
const cheerio = require("cheerio");
const axios = require("axios");
require("../db/conn");
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
// router.get("/", (req, res) => {
//   res.send("hello from another page");
// });
// router.get("/home", (req, res) => {
//   res.send("hello from another page 2");
// });

//cookie parser bhi install krna h

console.log("BLAHHHH");
router.post("/register", async (req, res) => {
  // console.log(abc);
  const {
    email,
    name,
    address,
    password,
    codechefID,
    codeforcesID,
    college,
    branch,
    desc,
    title,
    gfgID,
  } = req.body;
  console.log(name);
  // console.log(req.body);
  // console.log(xyz);

  if (
    (!name || !email || !password || !address || !codechefID, !codeforcesID)
  ) {
    return res.status(422).json({ error: "FILL KROOOOO" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email already exists" });
    } else {
      const user = new User({
        name,
        email,
        address,
        password,
        codechefID,
        codeforcesID,
        college,
        branch,
        desc,
        title,
        gfgID,
      });

      await user.save();
      return res.status(201).json({ message: "user registered successfully" });
    }
  } catch (err) {
    console.log(err);
  }
  // User.findOne({email:email})
  // .then((userExist)=>{
  //     if(userExist){
  //         return res.status(422).json({error:"EMAIL ALREADY EXIST"});
  //     }
  //     const user=new User({ name,email, password,quote});
  //     user.save().then(()=>{
  //         res.status(201).json({message: "user registered successfully"});
  //     }).catch((err)=>res.status(500).json({error:"FAILED TO REGISTERED"}));
  // }).catch(err=>{console.log(err);})
  // console.log(name);
  // console.log(email);
  // console.log(quote);

  res.json({ message: req.body });
});

router.post("/login", async (req, res) => {
  // console.log(req.body);
  // res.json({message:"hdkhk"})
  // console.log("djhjcs");

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("PLEASE FILL THE EMAIL PASSWORD");
    }

    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log("blah blah");
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      // res.use(cookieSession({
      //   name: 'session',
      //   keys: [/* secret keys */],

      //   // Cookie Options
      //   maxAge: 24 * 60 * 60 * 1000 // 24 hours
      // }))

      if (!isMatch) {
        res.status(400).json({ error: "user error" });
      } else {
        // console.log(token);
        res.json({ message: "user logged in", userDetails: userLogin });
      }
    } else {
      res.status(400).json({ error: "user error" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/editOptions", async (req, res) => {
  const { email, name, codechefID, codeforcesID } = req.body;
  console.log(name);

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      userExist.name = name;
      userExist.codechefID = codechefID;
      userExist.codeforcesID = codeforcesID;
      await userExist.save();
      res.status(201).json({ message: "user registered successfully" });
    } else {
      console.log("userNotFound");
    }
  } catch (err) {
    console.log(err);
  }
});
//home page

router.get("/home", authenticate, (req, res) => {
  console.log("HELLO FROM HOME");
  // res.send("HELLO WORLD FROM SERVER");
  // console.log(req.rootUser);
  res.send(req.rootUser);
});

router.get("/profile", authenticate, async (req, res) => {
  console.log("HELLO FROM Profile");
  const requestOne = axios.get(
    `https://www.codechef.com/users/${req.rootUser.codechefID}`
  );
  const requestTwo = axios.get(
    `https://codeforces.com/profile/${req.rootUser.codeforcesID}`
  );
  const requestThree = axios.get(
    `https://auth.geeksforgeeks.org/user/${req.rootUser.gfgID}/`
  );
  const requestFour = axios.get(
    `https://codeforces.com/submissions/${req.rootUser.codeforcesID}`
  );
  axios
    .all([requestOne, requestTwo, requestThree, requestFour])
    .then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];
        const responseThree = responses[2];

        const responseFour = responses[3];
        //  console.log(response);
        // console.log(response.data);
        const $ = cheerio.load(responseOne.data);
        let so = $(".content");
        let h = so.find("h5");
        so = $(h[0]).text();
        // console.log(solved);
        result = so.substring(
          so.lastIndexOf("(") + 1,

          so.lastIndexOf(")")
        );

        // result = so.substring(14, 17);
        // console.log(result);
        req.rootUser.codechefSub = result;

        let rating = $(".rating-number").text();
        req.rootUser.codechefRating = rating;

        let rank = $(".inline-list li a");
        let rankstrong = rank.find("strong");
        // console.log(rankstrong.length);
        rank = $(rankstrong[0]).text();
        req.rootUser.codechefRank = rank;

        let sub = [];
        let submission = $(
          "body > main > div > div > div > div > div > section:nth-child(7) > div > article > p:nth-child(28) > span > a:nth-child(1)"
        ).text();
        // console.log("213"+submission);

        $(
          "body > main > div > div > div > div > div > section:nth-child(7) > div > article > p:nth-last-child(1) > span > a"
        ).each((index, element) => {
          // console.log($(element).text());
          let jk = $(element).text();
          sub.push(jk);
        });
        // console.log(sub);
        req.rootUser.codechefSubmissions = sub;
        // $(" div:nth-child(1) > table > tbody > tr > td:nth-child(2)").each((index, element) => {
        //   console.log("213");
        //   console.log($(element).text());
        // });

        // let rowArray=$("#rankContentDiv > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)");
        // // let anchorArray=rowArray.find("a");
        // console.log(rowArray.html);
        // console.log($(rowArray[0]).text());
        // let spanArray=rowArray.find("span");
        // console.log(anchorArray);
        // for(let i=0;i<60;i++)
        // {
        // let x=$(spanArray[1]).attr("title");
        // console.log("x "+x);
        // let y=$(anchorArray[1]).attr("href");
        //   console.log("y"+y);
        // if(x=="accepted")
        // {
        //   let y=$(anchorArray[0]).text();
        //   console.log(y);
        // }
        // }
        // for(let i=0;i<rowArray.length;i++)
        // {
        //   let colArray=$(".dataTable tbody tr td");

        //   for(let j=0;j<)
        // }
        // let title=$("")
        // console.log(abc+"last");
        // console.log("2");
        // console.log(req.rootUser);
        // req.rootUser["codechefSub"] = "test";

        // console.log("3");
        // console.log(req.rootUser);
        // console.log("4");
        // req.rootUser.save(function (err, result) {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     console.log("result");
        //   }
        // });
        // res.send(req.rootUser);

        let a = cheerio.load(responseTwo.data);
        let so2 = a("._UserActivityFrame_footer");
        let h2 = so2.find("._UserActivityFrame_counterValue");
        so2 = a(h2[0]).text();

        const arr = so2.split(/ (.*)/);

        // result = so.substring(14, 17);
        // console.log(arr[0]);
        req.rootUser.codeforcesSub = arr[0];

        let codeforcesSubmissions = [];
        let z = cheerio.load(responseFour.data);
        // let xxcf = z(
        //   ".submissionVerdictWrapper span"
        // );
        // // console.log(zcf);
        // console.log(xxcf.text());

        var accept = [];
        var problem = [];
        z(".submissionVerdictWrapper span").each((index, element) => {
          // console.log($(element).text());
          let jks = z(element).text();
          accept.push(jks);
        });
        z(".status-small a").each((index, element) => {
          // console.log($(element).text());
          let jks = z(element).text();
          problem.push(jks);
        });
        for (let i = 0; i < 50; i++) {
          if (accept[i] === "Accepted") {
            codeforcesSubmissions.push(problem[i]);
          }
          // console.log("213" + zcf);
        }
        console.log(codeforcesSubmissions);
        req.rootUser.codeforcesSubmissions = codeforcesSubmissions;
        // for()

        // let so2 = a("._UserActivityFrame_footer");
        // let h2 = so2.find("._UserActivityFrame_counterValue");
        // so2 = a(h2[0]).text();

        // const arr = so2.split(/ (.*)/);

        // result = so.substring(14, 17);
        // console.log(arr[0]);
        // req.rootUser.codeforcesSub = arr[0];

        let b = cheerio.load(responseThree.data);
        let so3 = b(".row.score_cards_container");
        let h3 = so3.find(".score_card_value");
        so3 = b(h3[1]).text();

        // result = so.substring(14, 17);
        // console.log(result);
        // console.log(gfgSub);
        req.rootUser.gfgSub = so3;

        let rankgfg = b(".rankNum").text();
        req.rootUser.gfgRank = rankgfg;

        let gfgscore = b(".row.score_cards_container");
        let gfgs = gfgscore.find(".score_card_value");
        gfgscore = b(gfgs[0]).text();
        req.rootUser.gfgScore = gfgscore;

        var gfgSubmissions = [];
        b(".problemLink").each((index, element) => {
          // console.log($(element).text());
          let jks = z(element).text();
          gfgSubmissions.push(jks);
        });
        req.rootUser.gfgSubmissions = gfgSubmissions;
        //     // req.rootUser.save(function (err, result) {
        //     //   if (err) {
        //     //     console.log(err);
        //     //   } else {
        //     //     console.log(result);
        //     //   }
        //     // });
        //     // res.send(req.rootUser);

        req.rootUser.save(function (err, result) {
          if (err) {
            console.log(err);
          } else {
            // console.log(result);
          }
        });
        res.send(req.rootUser);

        // use/access the results
      })
    )
    .catch((errors) => {
      console.log(errors);
    });

  // res.send("HELLO WORLD FROM SERVER");
  // try {
  //   axios
  //     .get(``)
  //     .then((response) => {
  //       // console.log(response);
  //       // console.log(response.data);
  //       var newUser = new User(req.body);
  //       const $ = cheerio.load(response.data);
  //       let so = $(".content");
  //       let h = so.find("h5");
  //       so = $(h[0]).text();
  //       // console.log(solved);
  //       result = so.substring(14, 17);
  //       console.log(result);
  //       req.rootUser.codechefSub = result;

  //       console.log("1");
  //       let rating = $(".rating-number").text();
  //       req.rootUser.codechefRating = rating;

  //       let rank = $(".inline-list li a");
  //       let rankstrong = rank.find("strong");
  //       console.log(rankstrong.length);
  //       rank=$(rankstrong[0]).text();
  //       req.rootUser.codechefRank=rank;

  //       // $(".table-questions > table > tbody > tr > td").each((index, element) => {

  //       //   console.log($(element).text());

  //       //   });
  //       // let rowArray=$("#rankContentDiv > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)");
  //       // // let anchorArray=rowArray.find("a");
  //       // console.log(rowArray.html);
  //       // console.log($(rowArray[0]).text());
  //       // let spanArray=rowArray.find("span");
  //       // console.log(anchorArray);
  //       // for(let i=0;i<60;i++)
  //       // {
  //         // let x=$(spanArray[1]).attr("title");
  //         // console.log("x "+x);
  //         // let y=$(anchorArray[1]).attr("href");
  //         //   console.log("y"+y);
  //         // if(x=="accepted")
  //         // {
  //         //   let y=$(anchorArray[0]).text();
  //         //   console.log(y);
  //         // }
  //       // }
  //       // for(let i=0;i<rowArray.length;i++)
  //       // {
  //       //   let colArray=$(".dataTable tbody tr td");

  //       //   for(let j=0;j<)
  //       // }
  //       // let title=$("")
  //       // console.log(abc+"last");
  //       // console.log("2");
  //       // console.log(req.rootUser);
  //       // req.rootUser["codechefSub"] = "test";

  //       // console.log("3");
  //       // console.log(req.rootUser);
  //       // console.log("4");
  //       // req.rootUser.save(function (err, result) {
  //       //   if (err) {
  //       //     console.log(err);
  //       //   } else {
  //       //     console.log("result");
  //       //   }
  //       // });
  //       // res.send(req.rootUser);
  //     })
  //     .catch((err) => console.log(err));
  //   // data.headers['content-type'];
  // } catch (err) {
  //   res.status(500).send({ message: err.message });
  // }
  // try{
  //   axios
  //   .get(`https://codeforces.com/profile/${req.rootUser.codeforcesID}`)
  //   .then((response) => {
  //     // console.log(response);
  //     // console.log(response.data);
  //     var newUser = new User(req.body);
  //     const $ = cheerio.load(response.data);
  //     let so = $("._UserActivityFrame_footer");
  //     let h = so.find("._UserActivityFrame_counterValue");
  //     so = $(h[0]).text();

  //     const arr = so.split(/ (.*)/);

  //     // result = so.substring(14, 17);
  //     // console.log(result);
  //     req.rootUser.codeforcesSub = arr[0];

  //     // res.send(req.rootUser);
  //   })
  //   .catch((err) => console.log(err));
  // // data.headers['content-type'];
  // }
  // catch(err)
  // {
  //   console.log(err);
  // }

  // try{
  //   axios
  //   .get(`https://auth.geeksforgeeks.org/user/${req.rootUser.gfgID}/`)
  //   .then((response) => {
  //     // console.log(response);
  //     // console.log(response.data);
  //     var newUser = new User(req.body);
  //     const $ = cheerio.load(response.data);
  //     let so = $(".row.score_cards_container");
  //     let h = so.find(".score_card_value");
  //     so = $(h[1]).text();
  //     console.log(so);

  //     // result = so.substring(14, 17);
  //     // console.log(result);
  //     // console.log(gfgSub);
  //     req.rootUser.gfgSub = so;

  //     // req.rootUser.save(function (err, result) {
  //     //   if (err) {
  //     //     console.log(err);
  //     //   } else {
  //     //     console.log(result);
  //     //   }
  //     // });
  //     // res.send(req.rootUser);
  //     req.rootUser.save(function (err, result) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(result);
  //       }
  //     });
  //     res.send(req.rootUser);
  //   })
  //   .catch((err) => console.log(err));
  // // data.headers['content-type'];
  // }
  // catch(err)
  // {
  //   console.log(err);
  // }
});

router.get("/profile/:id", (req, res) => {
  console.log("HELLO FROM Profile2");
  // res.send("HELLO WORLD FROM SERVER");
  console.log(req.rootUser);
  res.send(req.rootUser);
});

router.post("/logout", (req, res) => {
  console.log("HELLO FROM logout");
  // res.send("HELLO WORLD FROM SERVER");
  res.clearCookie("jwtoken",{path:'/',domain:'www.mernbackend2-hgyy.onrender.com'});
  res.status(200).send("user logout");
});

module.exports = router;
