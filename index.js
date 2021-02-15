//---------- REQUIRES

const express = require('express'); //* 1
const app = express();//* 1
const expressLayouts = require('express-ejs-layouts');//* 1
const fs = require('fs');//* 1

//---------- MIDDLEWARE
app.use(expressLayouts)//* 1
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
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter
    //array method filter

    // if there is no submit of the form
    // this will be undefined, and we will return all dinos
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj) => {
            if (dinosaurObj.name === nameToFilterBy) {
                return true
            }
        })
        dinos = newFilteredArray
    }
    // console.log(newFilteredArray)
    // console.log(dinos)
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
    let dinos = fs.readFileSync('./dinosaurs.json')
    // this will take our data and put it into a more readable format ⬇️
    dinos = JSON.parse(dinos)
    //contruct a new dino with our req.body values
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }

    //updates our dinos with a new dino
    dinos.push(newDino)
    // going to overwrite and turn back into a string
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))

    //like doing a get request to .dinosaurs
    res.redirect('/dinosaurs')
    // this is coming from our form submit
    //we are going to look at the req.body
    // console.log(req.body)
})

const PORT = process.env.PORT || 8000; //* 1
app.listen(PORT, () => { console.log(`server is running on port ${PORT}🎧`) }); //* 1