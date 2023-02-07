const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/usermodel");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

//create a post

router.post("/", upload.single("image"), async (req, res) => {
  // console.log("POST PAGE");
  // console.log(req.body);
  // console.log("54");
  // console.log(req.file);
  var newPost = new Post(req.body);
  // console.log(newPost);
  try {
    // console.log(req.file.path);
    if (req.file.path) {
      req.body.img = req.file.filename;
      // console.log(req.body.img);
      // console.log("46");
      newPost.img = req.body.img;
    }
    const user = await User.findById(req.body.userId);
    // console.log(user);
    // console.log(newPost.profileimg);
    // console.log(user.img);
    newPost.profileimg = user.img;
    console.log("54");
    console.log(req.body);
    newPost.desc = req.body.postText;
    newPost.userName = req.body.name;
    // console.log(newPost.profileimg);
    var createdDt = new Date();
    newPost.time = createdDt;
    // Post.insertOne( { ts: new Timestamp() } );
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
      console.log(savedPost);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/codeforces", async (req, res) => {
  console.log("60");
  const newPost = new Post(req.body);
  console.log(newPost);
  try {
    const user = await User.findById(req.body.userId);
    // console.log(user);
    newPost.profileimg = user.img;
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(req.body.time);
    t.setHours(t.getHours() + 5);
    t.setMinutes(t.getMinutes() + 30);
    console.log("70");
    newPost.time = t;
    newPost.problemname = req.body.problemname;
    newPost.contestId = req.body.contestId;
    newPost.index = req.body.index;
    newPost.userName = req.body.userName;
    // const post = await Post.find();
    // const a=await ;
    // console.log(Post.find({ time: t }));
    Post.find({ time: t }, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("First function call : ", docs);
        if (docs.length === 0) {
          newPost.save();
        }
      }
    });

    // if(Post.find({time:t}))
    // {
    //   const savedPost = await newPost.save();
    // }

    console.log("72");
    console.log(newPost);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// //delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// //like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// //get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
    console.log(res);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //get timeline posts

router.get("/timeline/all/:userID", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userID);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser._followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
    // console.log(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
