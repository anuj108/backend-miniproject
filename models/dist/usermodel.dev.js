"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var User = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true
  },
  address: {
    type: String,
    max: 50
  },
  college: {
    type: String
  },
  branch: {
    type: String
  },
  title: {
    type: String
  },
  codechefID: {
    type: String,
    required: true
  },
  codechefSub: {
    type: String
  },
  codechefRating: {
    type: String
  },
  codechefRank: {
    type: String
  },
  skills: [],
  //   codechefRecent:[
  //     {
  //     submissions:{
  //       type: String,
  //     },
  //   },
  // ],
  gfgID: {
    type: String
  },
  gfgSub: {
    type: String
  },
  gfgRank: {
    type: String,
    "default": ""
  },
  gfgScore: {
    type: String
  },
  codeforcesID: {
    type: String,
    required: true
  },
  codeforcesSub: {
    type: String
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  quote: {
    type: String
  },
  img: {
    type: String,
    "default": "uploads/"
  },
  coverPicture: {
    type: String,
    "default": ""
  },
  followers: [{
    id: {
      type: String
    },
    name: {
      type: String
    },
    image: {
      type: String
    }
  }],
  followings: [{
    id: {
      type: String
    },
    name: {
      type: String
    },
    image: {
      type: String
    }
  }],
  _followers: {
    type: Array,
    "default": []
  },
  _followings: {
    type: Array,
    "default": []
  },
  isAdmin: {
    type: Boolean,
    "default": false
  },
  desc: {
    type: String,
    max: 50
  },
  city: {
    type: String,
    max: 50
  },
  relationship: {
    type: Number,
    "enum": [1, 2, 3]
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  collection: "user-data"
}, {
  timestamps: true
}); //hashing

User.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified("password")) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 3:
          this.password = _context.sent;

        case 4:
          next();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

User.methods.generateAuthToken = function _callee2() {
  var tokenabcd;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          tokenabcd = jwt.sign({
            _id: this._id
          }, process.env.SECRET_KEY);
          this.tokens = this.tokens.concat({
            token: tokenabcd
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(this.save());

        case 5:
          return _context2.abrupt("return", tokenabcd);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this, [[0, 8]]);
};

var model = mongoose.model("UserData", User);
module.exports = model;