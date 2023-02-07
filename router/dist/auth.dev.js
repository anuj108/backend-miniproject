"use strict";

var express = require("express");

var _require = require("../models/usermodel"),
    countDocuments = _require.countDocuments;

var router = express.Router();

var jwt = require("jsonwebtoken");

var authenticate = require("../middleware/authenticate");

var solved = require("../web-scrapping/codechef-ki-api.js");

var cheerio = require("cheerio");

var axios = require("axios");

require("../db/conn");

var User = require("../models/usermodel");

var bcrypt = require("bcryptjs"); // router.get("/", (req, res) => {
//   res.send("hello from another page");
// });
// router.get("/home", (req, res) => {
//   res.send("hello from another page 2");
// });
//cookie parser bhi install krna h


console.log("BLAHHHH");
router.post("/register", function _callee(req, res) {
  var _req$body, email, name, address, password, codechefID, codeforcesID, college, branch, desc, title, gfgID, userExist, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // console.log(abc);
          _req$body = req.body, email = _req$body.email, name = _req$body.name, address = _req$body.address, password = _req$body.password, codechefID = _req$body.codechefID, codeforcesID = _req$body.codeforcesID, college = _req$body.college, branch = _req$body.branch, desc = _req$body.desc, title = _req$body.title, gfgID = _req$body.gfgID;
          console.log(name); // console.log(req.body);
          // console.log(xyz);

          if (!(!name || !email || !password || !address || !codechefID, !codeforcesID)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "FILL KROOOOO"
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          userExist = _context.sent;

          if (!userExist) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(422).json({
            error: "email already exists"
          }));

        case 12:
          user = new User({
            name: name,
            email: email,
            address: address,
            password: password,
            codechefID: codechefID,
            codeforcesID: codeforcesID,
            college: college,
            branch: branch,
            desc: desc,
            title: title,
            gfgID: gfgID
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          return _context.abrupt("return", res.status(201).json({
            message: "user registered successfully"
          }));

        case 16:
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](4);
          console.log(_context.t0);

        case 21:
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
          res.json({
            message: req.body
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 18]]);
});
router.post("/login", function _callee2(req, res) {
  var _req$body2, email, password, userLogin, isMatch, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json("FILL KROOOOOOOOO"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          userLogin = _context2.sent;
          console.log(userLogin);

          if (!userLogin) {
            _context2.next = 21;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, userLogin.password));

        case 11:
          isMatch = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(userLogin.generateAuthToken());

        case 14:
          token = _context2.sent;
          console.log("blah blah");
          console.log(token);
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
          }); // res.use(cookieSession({
          //   name: 'session',
          //   keys: [/* secret keys */],
          //   // Cookie Options
          //   maxAge: 24 * 60 * 60 * 1000 // 24 hours
          // }))

          if (!isMatch) {
            res.status(400).json({
              error: "user error"
            });
          } else {
            // console.log(token);
            res.json({
              message: "user logged in",
              userDetails: userLogin
            });
          }

          _context2.next = 22;
          break;

        case 21:
          res.status(400).json({
            error: "user error"
          });

        case 22:
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 24]]);
});
router.post("/editOptions", function _callee3(req, res) {
  var _req$body3, email, name, codechefID, codeforcesID, userExist;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, name = _req$body3.name, codechefID = _req$body3.codechefID, codeforcesID = _req$body3.codeforcesID;
          console.log(name);
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          userExist = _context3.sent;

          if (!userExist) {
            _context3.next = 15;
            break;
          }

          userExist.name = name;
          userExist.codechefID = codechefID;
          userExist.codeforcesID = codeforcesID;
          _context3.next = 12;
          return regeneratorRuntime.awrap(userExist.save());

        case 12:
          res.status(201).json({
            message: "user registered successfully"
          });
          _context3.next = 16;
          break;

        case 15:
          console.log("userNotFound");

        case 16:
          _context3.next = 21;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](2);
          console.log(_context3.t0);

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 18]]);
}); //home page

router.get("/home", authenticate, function (req, res) {
  console.log("HELLO FROM HOME"); // res.send("HELLO WORLD FROM SERVER");
  // console.log(req.rootUser);

  res.send(req.rootUser);
});
router.get("/profile", authenticate, function _callee4(req, res) {
  var requestOne, requestTwo, requestThree;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("HELLO FROM Profile");
          requestOne = axios.get("https://www.codechef.com/users/".concat(req.rootUser.codechefID));
          requestTwo = axios.get("https://codeforces.com/profile/".concat(req.rootUser.codeforcesID));
          requestThree = axios.get("https://auth.geeksforgeeks.org/user/".concat(req.rootUser.gfgID, "/"));
          axios.all([requestOne, requestTwo, requestThree]).then(axios.spread(function () {
            var responseOne = arguments.length <= 0 ? undefined : arguments[0];
            var responseTwo = arguments.length <= 1 ? undefined : arguments[1];
            var responseThree = arguments.length <= 2 ? undefined : arguments[2]; //  console.log(response);
            // console.log(response.data);

            var $ = cheerio.load(responseOne.data);
            var so = $(".content");
            var h = so.find("h5");
            so = $(h[0]).text(); // console.log(solved);

            result = so.substring(so.lastIndexOf("(") + 1, so.lastIndexOf(")")); // result = so.substring(14, 17);
            // console.log(result);

            req.rootUser.codechefSub = result;
            console.log("1");
            var rating = $(".rating-number").text();
            req.rootUser.codechefRating = rating;
            var rank = $(".inline-list li a");
            var rankstrong = rank.find("strong");
            console.log(rankstrong.length);
            rank = $(rankstrong[0]).text();
            req.rootUser.codechefRank = rank; // $(".table-questions > table > tbody > tr > td").each((index, element) => {
            //   console.log($(element).text());
            //   });
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

            var a = cheerio.load(responseTwo.data);
            var so2 = a("._UserActivityFrame_footer");
            var h2 = so2.find("._UserActivityFrame_counterValue");
            so2 = a(h2[0]).text();
            var arr = so2.split(/ (.*)/); // result = so.substring(14, 17);

            console.log(arr[0]);
            req.rootUser.codeforcesSub = arr[0];
            var b = cheerio.load(responseThree.data);
            var so3 = b(".row.score_cards_container");
            var h3 = so3.find(".score_card_value");
            so3 = b(h3[1]).text();
            console.log(so3); // result = so.substring(14, 17);
            // console.log(result);
            // console.log(gfgSub);

            req.rootUser.gfgSub = so3;
            var rankgfg = b(".rankNum").text();
            req.rootUser.gfgRank = rankgfg;
            console.log(rankgfg);
            var gfgscore = b(".row.score_cards_container");
            var gfgs = gfgscore.find(".score_card_value");
            gfgscore = b(gfgs[0]).text();
            req.rootUser.gfgScore = gfgscore; //     // req.rootUser.save(function (err, result) {
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
                console.log(result);
              }
            });
            res.send(req.rootUser); // use/access the results
          }))["catch"](function (errors) {
            console.log(errors);
          }); // res.send("HELLO WORLD FROM SERVER");
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

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.get("/profile/:id", function (req, res) {
  console.log("HELLO FROM Profile2"); // res.send("HELLO WORLD FROM SERVER");

  console.log(req.rootUser);
  res.send(req.rootUser);
});
router.get("/logout", function (req, res) {
  console.log("HELLO FROM logout"); // res.send("HELLO WORLD FROM SERVER");

  res.clearCookie("jwtoken", {
    path: "/"
  });
  res.status(200).send("user logout");
});
module.exports = router;