const User = require("../models/usermodel");
const router = require("express").Router();
const bcrypt = require("bcrypt");
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

//*
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
router.put("/:id", upload.single("image"), async (req, res) => {
  console.log(req);
  console.log("54");
  console.log(req.file);

  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    if (req.file) {
      req.body.img = req.file.filename;
      console.log(req.body.img);
      console.log("68");
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.send(user);
      // res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  console.log("109");
  console.log(req.body);
  console.log(req.body.userId);
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      console.log("112");
      console.log(req.body);
      const currentUser = await User.findById(req.body.userId);
      console.log("115");
      console.log(currentUser);
      console.log(req.body.userId);

      console.log(user._followers.includes(req.body.userId));
      if (!user._followers.includes(req.body.userId)) {
        var objfollowers1 = {
          id: req.body.userId,
          name: currentUser.name,
          image: currentUser.img,
        };
        var objfollowers2 = {
          id: req.params.id,
          name: user.name,
          image: user.img,
        };
        await user.updateOne({
          $push: { followers: objfollowers1, _followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: objfollowers2, _followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        // res.status(403).json("you already follow this user");
        return res.status(403).send("you already follow this user");
        // windows.alert("you already follow this user");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user._followers.includes(req.body.userId)) {
        var objfollowers1 = {
          id: req.body.userId,
          name: currentUser.name,
          image: currentUser.img,
        };
        var objfollowers2 = {
          id: req.params.id,
          name: user.name,
          image: user.img,
        };
        await user.updateOne({
          $pull: { followers: objfollowers1, _followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { followings: objfollowers2, _followings: req.params.id },
        });
        // await user.updateOne({ $pull: { followers: req.body.userId } });
        // await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

//search a user
router.post("/search", async (req, res) => {
  console.log("194");
  console.log(req.rootUser);
  // res.json({message:"hdkhk"})
  // console.log("djhjcs");

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json("FILL KROOOOOOOOO");
    }

    const userSearch = await User.find({ name: name });
    console.log("213");
    console.log(userSearch);
    if (userSearch.length != 0) {
      // res.use(cookieSession({
      //   name: 'session',
      //   keys: [/* secret keys */],

      //   // Cookie Options
      //   maxAge: 24 * 60 * 60 * 1000 // 24 hours
      // }))
      // console.log(token);
      res.json({ message: "user found", userDetails: userSearch });
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
