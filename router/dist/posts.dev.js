"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var router = require("express").Router();

var Post = require("../models/post");

var User = require("../models/usermodel");

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
}); //create a post

router.post("/", upload.single("image"), function _callee(req, res) {
  var newPost, user, createdDt, savedPost;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // console.log("POST PAGE");
          // console.log(req.body);
          // console.log("54");
          // console.log(req.file);
          newPost = new Post(req.body); // console.log(newPost);

          _context.prev = 1;

          // console.log(req.file.path);
          if (req.file.path) {
            req.body.img = req.file.filename; // console.log(req.body.img);
            // console.log("46");

            newPost.img = req.body.img;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(User.findById(req.body.userId));

        case 5:
          user = _context.sent;
          // console.log(user);
          // console.log(newPost.profileimg);
          // console.log(user.img);
          newPost.profileimg = user.img;
          console.log("54");
          console.log(req.body);
          newPost.desc = req.body.postText;
          newPost.userName = req.body.name; // console.log(newPost.profileimg);

          createdDt = new Date();
          newPost.time = createdDt; // Post.insertOne( { ts: new Timestamp() } );

          _context.prev = 13;
          _context.next = 16;
          return regeneratorRuntime.awrap(newPost.save());

        case 16:
          savedPost = _context.sent;
          res.status(200).json(savedPost);
          console.log(savedPost);
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](13);
          console.log(_context.t0);

        case 24:
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t1 = _context["catch"](1);
          res.status(500).json(_context.t1);

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 26], [13, 21]]);
});
router.post("/codeforces", function _callee2(req, res) {
  var newPost, user, t;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("60");
          newPost = new Post(req.body);
          console.log(newPost);
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findById(req.body.userId));

        case 6:
          user = _context2.sent;
          // console.log(user);
          newPost.profileimg = user.img;
          t = new Date(1970, 0, 1); // Epoch

          t.setSeconds(req.body.time);
          t.setHours(t.getHours() + 5);
          t.setMinutes(t.getMinutes() + 30);
          console.log("70");
          newPost.time = t;
          newPost.problemname = req.body.problemname;
          newPost.contestId = req.body.contestId;
          newPost.index = req.body.index;
          newPost.userName = req.body.userName; // const post = await Post.find();
          // const a=await ;
          // console.log(Post.find({ time: t }));

          Post.find({
            time: t
          }, function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("First function call : ", docs);

              if (docs.length === 0) {
                newPost.save();
              }
            }
          }); // if(Post.find({time:t}))
          // {
          //   const savedPost = await newPost.save();
          // }

          console.log("72");
          console.log(newPost);
          res.status(200).json(newPost);
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](3);
          res.status(500).json(_context2.t0);

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 24]]);
}); //update a post

router.put("/:id", function _callee3(req, res) {
  var post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Post.findById(req.params.id));

        case 3:
          post = _context3.sent;

          if (!(post.userId === req.body.userId)) {
            _context3.next = 10;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(post.updateOne({
            $set: req.body
          }));

        case 7:
          res.status(200).json("the post has been updated");
          _context3.next = 11;
          break;

        case 10:
          res.status(403).json("you can update only your post");

        case 11:
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json(_context3.t0);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // //delete a post

router["delete"]("/:id", function _callee4(req, res) {
  var post;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Post.findById(req.params.id));

        case 3:
          post = _context4.sent;

          if (!(post.userId === req.body.userId)) {
            _context4.next = 10;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(post.deleteOne());

        case 7:
          res.status(200).json("the post has been deleted");
          _context4.next = 11;
          break;

        case 10:
          res.status(403).json("you can delete only your post");

        case 11:
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json(_context4.t0);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // //like / dislike a post

router.put("/:id/like", function _callee5(req, res) {
  var post;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Post.findById(req.params.id));

        case 3:
          post = _context5.sent;

          if (post.likes.includes(req.body.userId)) {
            _context5.next = 10;
            break;
          }

          _context5.next = 7;
          return regeneratorRuntime.awrap(post.updateOne({
            $push: {
              likes: req.body.userId
            }
          }));

        case 7:
          res.status(200).json("The post has been liked");
          _context5.next = 13;
          break;

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(post.updateOne({
            $pull: {
              likes: req.body.userId
            }
          }));

        case 12:
          res.status(200).json("The post has been disliked");

        case 13:
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json(_context5.t0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); // //get a post

router.get("/:id", function _callee6(req, res) {
  var post;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Post.findById(req.params.id));

        case 3:
          post = _context6.sent;
          res.status(200).json(post);
          console.log(res);
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json(_context6.t0);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // //get timeline posts

router.get("/timeline/all/:userID", function _callee7(req, res) {
  var currentUser, userPosts, friendPosts;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userID));

        case 3:
          currentUser = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(Post.find({
            userId: currentUser._id
          }));

        case 6:
          userPosts = _context7.sent;
          _context7.next = 9;
          return regeneratorRuntime.awrap(Promise.all(currentUser._followings.map(function (friendId) {
            return Post.find({
              userId: friendId
            });
          })));

        case 9:
          friendPosts = _context7.sent;
          res.json(userPosts.concat.apply(userPosts, _toConsumableArray(friendPosts))); // console.log(userPosts);

          _context7.next = 16;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json(_context7.t0);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
module.exports = router;