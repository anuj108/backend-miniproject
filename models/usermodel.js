const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema(
  {
    name: { type: String, require: true, min: 3, max: 20, unique: true },
    email: { type: String, required: true, max: 50, unique: true },
    address: { type: String, max: 50 },
    college: { type: String },
    branch: { type: String },
    title: { type: String },
    codechefID: { type: String, required: true },
    codechefSub: { type: String },
    codechefSubmissions: { type: Array, default: [] },
    codechefRating: { type: String },
    codechefRank: { type: String },
    skills: [],
    gfgID: { type: String },
    gfgSub: { type: String },
    gfgRank: { type: String, default: "" },
    gfgScore: { type: String },
    gfgSubmissions: { type: Array, default: [] },
    codeforcesID: { type: String, required: true },
    codeforcesSub: { type: String },
    codeforcesSubmissions: { type: Array, default: [] },
    password: { type: String, required: true, min: 6 },
    quote: { type: String },
    img: {type: String,default: "uploads/",},
    coverPicture: {type: String,default: "",},
    followers: [
      {
        id: {
          type: String,
        },
        name: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    followings: [
      {
        id: {
          type: String,
        },
        name: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    _followers: {
      type: Array,
      default: [],
    },
    _followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { collection: "user-data" },
  { timestamps: true }
);

//hashing
User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

User.methods.generateAuthToken = async function () {
  try {
    let tokenabcd = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: tokenabcd });
    await this.save();
    return tokenabcd;
  } catch (err) {
    console.log(err);
  }
};

const model = mongoose.model("UserData", User);

module.exports = model;
