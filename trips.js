
// loading the module
const express = require('express')
const app = express()
var session = require('express-session')

//variables
let trips = []
let users = []

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

//


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
  console.log(req.session.username)
  res.render('profile',{usernameReg : req.session.usernameReg, username : req.session.username, Logout: req.session.Logout,
    tripsList : trips})

  })

//Logout function

app.post('/logout',function(req,res){ 
// go to the logout page
res.redirect('/logout')
})

app.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/login')
})

//Working with Trip Post for Logged In Users

app.post('/profile',function(req,res){
  console.log('profile')
  let usernameReg  = req.body.usernameReg
  let passwordReg = req.body.passwordReg
  let username  = req.body.username
  let password = req.body.password
  let Logout = "Logout"  

  if(req.session) {
    req.session.usernameReg = usernameReg
    req.session.passwordReg = passwordReg
    req.session.username = username
    req.session.password = password
    req.session.Logout = Logout 
     //setting the expiration date of the cookies so we can
     //30 minute expiry time
    var time = 180000
    req.session.cookie.expires = new Date(Date.now() + time)
    req.session.cookie.maxAge = time



// go to the profile page
res.redirect('/profile')

}

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
    res.render('views', {tripsList : trips})
  })
  
  app.post('/views',function(req,res){
  
    let title = req.body.title

    let tripId = guid()

    let imageURL = req.body.imageURL

    let departure = req.body.departure

    let arrival = req.body.arrival

    trips.push({title : title, image : imageURL, departure : departure, arrival : arrival, tripId : tripId})

    res.render('views', {tripsList : trips})
  
  })

  //Delete Post

  app.post('/deleteTrip',function(req,res){

    let tripId = req.body.tripId
    // give me all the trips where the tripId is not the one passed in the request
    trips = trips.filter(function(trip){
      return trip.tripId != tripId
    })
    if(req.session.username) {
      res.render('profile',{usernameReg : req.session.usernameReg, username : req.session.username, Logout: req.session.Logout,
        tripsList : trips})
      res.redirect('/profile')
    } else {
      res.render('views', {tripsList : trips})
      res.redirect('/views')
    }
  
  })


// get the guid
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
  
  
  app.listen(3000, () => console.log('Example app listening on port 3000!'))