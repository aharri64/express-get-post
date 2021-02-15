//---------- REQUIRES

const express = require('express'); //* 1
const app = express();//* 1
const expressLayouts = require('express-ejs-layouts');//* 1
const fs = require('fs');//* 1

//---------- MIDDLEWARE
app.use(expressLayouts)//* 1
//this will help us use our layout file ⬆️
app.use(express.urlencoded({ extended: false })) //* 4 this is body parser

app.set('view engine', 'ejs') //* 2


//---------- ROUTES
app.get('/', (req, res) => { //* 1
    res.send('hi there')
})

//Index View
app.get('/dinosaurs', (req, res) => { //* 1
    let dinos = fs.readFileSync('./dinosaurs.json') //! 1. readFileSync will take the infot in dinosaurs.json and then print it on to the page
    dinos = JSON.parse(dinos) //! 1. this will take our data and put it into a more readable format
    ////console.log(req.query.nameFilter)
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
    // //console.log(newFilteredArray)
    // //console.log(dinos) 1.
    res.render('dinosaurs/index', { dinos: dinos }) // ! 1. in our views folder render this page with {this} data to pass to it
});



// NEW VIEW //* 4. part of the post route
//? This route must be above the show view!! most specific to least specific url path
app.get('/dinosaurs/new', (req, res) => {
    res.render('dinosaurs/new')
}); //! this is just where a user can input a new dino to the app

//SHOW VIEW //* 3
app.get('/dinosaurs/:index', (req, res) => {     //! :index will get the dino that's asked for
    let dinos = fs.readFileSync('./dinosaurs.json') //! readFileSync will take the infot in dinosaurs.json and then print it on to the page
    dinos = JSON.parse(dinos) //! this will take our data and put it into a more readable format 
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', { dino }) //? {dino} is the same as saying {dinos: dinos}
})



// POST route, doesn't have a view //* 4. part 2 of the post route

app.post('/dinosaurs', (req, res) => {
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)
    const newDino = {     //! when we deal with forms we want to look at !!!__req.body__!!!
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