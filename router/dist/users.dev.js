"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var User = require("../models/usermodel");

var router = require("express").Router();

var bcrypt = require("bcrypt");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
}); //*
// router.put("/updatepic", (req, res) => {
//   User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { pic: req.body.pic } },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         return res.status(422).json({ error: "pic canot post" });
//       }
//       res.json(result);
//     }
//   );
// });
//*
//update user

router.put("/:id", upload.single("image"), function _callee(req, res) {
  var salt, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req);
          console.log("54");
          console.log(req.file);

          if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
            _context.next = 30;
            break;
          }

          if (!req.body.password) {
            _context.next = 17;
            break;
          }

          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 8:
          salt = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, salt));

        case 11:
          req.body.password = _context.sent;
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](5);
          return _context.abrupt("return", res.status(500).json(_context.t0));

        case 17:
          if (req.file) {
            req.body.img = req.file.filename;
            console.log(req.body.img);
            console.log("68");
          }

          _context.prev = 18;
          _context.next = 21;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
            $set: req.body
          }));

        case 21:
          user = _context.sent;
          res.send(user); // res.status(200).json("Account has been updated");

          _context.next = 28;
          break;

        case 25:
          _context.prev = 25;
          _context.t1 = _context["catch"](18);
          return _context.abrupt("return", res.status(500).json(_context.t1));

        case 28:
          _context.next = 31;
          break;

        case 30:
          return _context.abrupt("return", res.status(403).json("You can update only your account!"));

        case 31:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 14], [18, 25]]);
}); //delete user

router["delete"]("/:id", function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.body.userId === req.params.id || req.body.isAdmin)) {
            _context2.next = 12;
            break;
          }

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.params.id));

        case 4:
          res.status(200).json("Account has been deleted");
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", res.status(500).json(_context2.t0));

        case 10:
          _context2.next = 13;
          break;

        case 12:
          return _context2.abrupt("return", res.status(403).json("You can delete only your account!"));

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7]]);
}); //get a user

router.get("/:id", function _callee3(req, res) {
  var user, _user$_doc, password, updatedAt, other;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          user = _context3.sent;
          _user$_doc = user._doc, password = _user$_doc.password, updatedAt = _user$_doc.updatedAt, other = _objectWithoutProperties(_user$_doc, ["password", "updatedAt"]);
          res.status(200).json(other);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); //follow a user

router.put("/:id/follow", function _callee4(req, res) {
  var user, currentUser, objfollowers1, objfollowers2;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.body.userId !== req.params.id)) {
            _context4.next = 34;
            break;
          }

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 4:
          user = _context4.sent;
          console.log("112");
          console.log(user);
          _context4.next = 9;
          return regeneratorRuntime.awrap(User.findById(req.body.userId));

        case 9:
          currentUser = _context4.sent;
          console.log("115");
          console.log(currentUser);
          console.log(user.fol);
          console.log(req.body.userId);
          console.log(user._followers.includes(req.body.userId));

          if (user._followers.includes(req.body.userId)) {
            _context4.next = 25;
            break;
          }

          objfollowers1 = {
            id: req.body.userId,
            name: currentUser.name,
            image: currentUser.img
          };
          objfollowers2 = {
            id: req.params.id,
            name: user.name,
            image: user.img
          };
          _context4.next = 20;
          return regeneratorRuntime.awrap(user.updateOne({
            $push: {
              followers: objfollowers1,
              _followers: req.body.userId
            }
          }));

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(currentUser.updateOne({
            $push: {
              followings: objfollowers2,
              _followings: req.params.id
            }
          }));

        case 22:
          res.status(200).json("user has been followed");
          _context4.next = 27;
          break;

        case 25:
          res.status(403).json("you already follow this user");
          windows.alert("you already follow this user");

        case 27:
          _context4.next = 32;
          break;

        case 29:
          _context4.prev = 29;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json(_context4.t0);

        case 32:
          _context4.next = 35;
          break;

        case 34:
          res.status(403).json("you can't follow yourself");

        case 35:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 29]]);
}); //unfollow a user

router.put("/:id/unfollow", function _callee5(req, res) {
  var user, currentUser, objfollowers1, objfollowers2;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.body.userId !== req.params.id)) {
            _context5.next = 26;
            break;
          }

          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 4:
          user = _context5.sent;
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(req.body.userId));

        case 7:
          currentUser = _context5.sent;

          if (!user._followers.includes(req.body.userId)) {
            _context5.next = 18;
            break;
          }

          objfollowers1 = {
            id: req.body.userId,
            name: currentUser.name,
            image: currentUser.img
          };
          objfollowers2 = {
            id: req.params.id,
            name: user.name,
            image: user.img
          };
          _context5.next = 13;
          return regeneratorRuntime.awrap(user.updateOne({
            $pull: {
              followers: objfollowers1,
              _followers: req.body.userId
            }
          }));

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(currentUser.updateOne({
            $pull: {
              followings: objfollowers2,
              _followings: req.params.id
            }
          }));

        case 15:
          // await user.updateOne({ $pull: { followers: req.body.userId } });
          // await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
          _context5.next = 19;
          break;

        case 18:
          res.status(403).json("you dont follow this user");

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json(_context5.t0);

        case 24:
          _context5.next = 27;
          break;

        case 26:
          res.status(403).json("you cant unfollow yourself");

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 21]]);
});
module.exports = router;