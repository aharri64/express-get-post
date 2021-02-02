//---------- REQUIRES
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')

//---------- MIDDLEWARE
app.use(expressLayouts)
//this will help us use our layout file ⬆️
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')


//---------- ROUTES
app.get('/', (req, res) => {
    res.send('hi there')
})

//Index View
app.get('/dinosaurs', (req, res) => {
    // in our views folder render this page
    let dinos = fs.readFileSync('./dinosaurs.json')
    // this will take our data and put it into a more readable format ⬇️
    dinos = JSON.parse(dinos)
    console.log(dinos)
    // in our views folder render this page
    res.render('dinosaurs/index', { dinos: dinos })
})

// NEW VIEW
// most specific tp least specific url path
app.get('/dinosaurs/new', (req, res) => {
    res.render('dinosaurs/new')
})

//SHOW VIEW
app.get('/dinosaurs/:index', (req, res) => {
    let dinos = fs.readFileSync('./dinosaurs.json')
    // this will take our data and put it into a more readable format ⬇️
    dinos = JSON.parse(dinos)
    //get the dino that's asked for
    // req.params.index
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', { dino })
})



// POST route, doesn't have a view

app.post('/dinosaurs', (req, res) => {
    // this is coming from our form submit
    //we are going to look at the req.body
})
const PORT = process.env.PORT || 8000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}🎧`) })