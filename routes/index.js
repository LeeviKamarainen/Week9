

var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const {body, validationResult} = require('express-validator')
const User = require('../models/Users');
const Todo = require('../models/Todo');
const jwt = require("jsonwebtoken");
const validateToken = require('../auth/validateToken.js');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


router.get('/api/user/register', (req, res, next) => {
  res.render('register')
});


router.get('/api/user/login', (req, res, next) => {
  res.render('login')

});

router.post('/api/user/login',
body("email").trim().escape(),
body("password"),
(req,res) => {
  const user = User.findOne({email: req.body.email}, (err, user) => {
    if(err) throw err;
    if(!user) {
      console.log(user)
      return res.status(403).json({message: "Login failed"});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          const jwtPayload = {
            id: user._id,
            email: user.email,
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token) => {
              res.json({success: true, token});
            }
          );
        }
      })
    }

  })
}
)

router.post('/api/todos', validateToken, (req,res, next) => {
  Todo.findOne({user: req.user.id}, (err, todo) => {
    if(err) throw err
      if(todo) {
        for (let index = 0; index < req.body.items.length; index++) {
          todo.items.push(req.body.items[index])
        }
        todo.user = req.user.id;
        todo.save()
        console.log("Todo: " + todo)
        return res.json({message: "Todos appended."})
      } else {
        Todo.create(
          {
            user: req.user.id,
            items: req.body.items
          },
          (err, ok) => {
            if(err) throw err;
            console.log("OK:" +ok)
            return res.send("Todo added")
          });
      }
  })
}
)

router.get('/api/todos/list', (req, res, next) => {
  res.send(todos)

});

router.get('/api/user/list', (req, res, next) => {
  User.find({},(err, users) => {
    if(err) return next(err);
    res.send(users)
  })

});

router.get('/api/private', validateToken, (req,res,next) => {
  res.json({email: req.user.email});
})

router.post("/api/user/register",
  body("email").isLength({min: 3}).trim().escape(),
  body("password").isStrongPassword(),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) throw err
      if(user) {
        return res.status(403).json({email: "Username already in use"})
      } else {
        console.log("Adding new user");
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err,hash) => {
            if(err) throw err;
            User.create(
              {
                email: req.body.email,
                password: hash
              },
              (err, ok) => {
                if(err) throw err;
                return res.redirect("/api/user/login");
              });
            })
          })
        }
      })
});

module.exports = router;
