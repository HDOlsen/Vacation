
// loading the module
const express = require('express')
const app = express()
var session = require('express-session')

// setting up middleware to use the session
app.use(session({
  secret: 'guest',
  resave: true,
  saveUninitialized: true
}))

// body parser for parsing JSON
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let trips = []
let users = []

// this means localhost:3000/site.css will work
app.use(express.static('style'))


var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress())

app.set('view engine', 'mustache')

app.set('views', './views')


//Working with Registration and Authentication

app.get('/login',function(req,res){
  res.render('login')
})

app.get('/profile',function(req,res){
  console.log(req.session.usernameReg)
  console.log(req.session.Logout)
  res.render('profile',{usernameReg : req.session.usernameReg, username : req.session.username, Logout: req.session.Logout})
  if(req.session.out) {
    res.redirect('/login')
    res.session.cookie.expires 
  } else {
    res.render('profile')
  }


})

app.post('/profile',function(req,res){
  console.log('profile')
  let usernameReg  = req.body.usernameReg
  let passwordReg = req.body.passwordReg
  let username  = req.body.username
  let password = req.body.password
  let Logout = "Logout"
  let out = req.body.out

  if(req.session) {
    req.session.usernameReg = usernameReg
    req.session.passwordReg = passwordReg
    req.session.username = username
    req.session.password = password
    req.session.Logout = Logout
    req.session.out = out
     //setting the expiration date of the cookies so we can
     //30 minute expiry time
    var time = 300000
    req.session.cookie.expires = new Date(Date.now() + time)
    req.session.cookie.maxAge = time



}

  // go to the profile page
  res.redirect('/profile')

})

//Working with Login 




function validateLogin(req,res,next) {

  if(req.session.username) {
    next()
  } else {
    res.redirect('/login')
  }

}

//Access to all pages
app.all('/views/*',validateLogin,function(req,res,next){
  next()

})


//Working with Trip Post


app.get('/',function(req,res){
    res.render('views', {title: "title"})
  })
  
  app.post('/trips',function(req,res){
  
    let title = req.body.title

    let image = req.body.image

    let departure = req.body.departure

    let arrival = req.body.arrival

    trips.push({title : title, image : image, departure : departure, arrival : arrival})

    res.render('views', {tripsList : trips})
  
  })
  
  
  app.listen(3000, () => console.log('Example app listening on port 3000!'))