
// loading the module
const express = require('express')
const app = express()

// body parser for parsing JSON
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let trips = []

// this means localhost:3000/site.css will work
app.use(express.static('style'))


var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress())

app.set('view engine', 'mustache')
app.set('views', './views')

app.get('/',function(req,res){
    res.render('views', {title: "title"})
  })
  
  app.post('/trips',function(req,res){
  
    let title = req.body.title
    trips.push({title : title})

    let image = req.body.image
    trips.push({image : image.jpg})

    let departure = req.body.departure
    trips.push({departure : departure})

    let arrival = req.body.arrival
    trips.push({arrival : arrival})

    res.render('views', {tripsList : trips})
  
  })
  
  
  app.listen(3000, () => console.log('Example app listening on port 3000!'))