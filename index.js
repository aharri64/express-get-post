//---------- REQUIRES

const express = require('express'); //* 1.1
const app = express();//* 1.1
const expressLayouts = require('express-ejs-layouts');//* 1.1
const fs = require('fs');//* 1.1
const methodOverride = require('method-override'); //* 2.1

//---------- MIDDLEWARE
app.use(expressLayouts)//* 1.1
//this will help us use our layout file ⬆️
app.use(express.urlencoded({ extended: false })) //* 4 this is body parser
app.use(methodOverride('_method')); //* 2.1


app.set('view engine', 'ejs') //* 1.2


//---------- ROUTES
app.get('/', (req, res) => { //* 1.1
    res.send('hi there')
})

//Index View
app.get('/dinosaurs', (req, res) => { //* 1
    let dinos = fs.readFileSync('./dinosaurs.json') //! 1. readFileSync will take the infot in dinosaurs.json and then print it on to the page
    dinos = JSON.parse(dinos) //! 1. this will take our data and put it into a more readable format

    ////console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter           //*array method filter
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj) => {       //! this will iterate through the array and check if the name: of the dino is the same as dinos.filter(dinosaurObj)
            //? we could also put return (dinosaurObj.name === nameToFilterBy)
            if (dinosaurObj.name === nameToFilterBy) {
                //? can also (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase())
                //! This will turn both values to lower case so that they can match, in case out user wants to use upper case or capitals
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


// app.put('dinosaurs/edit/:idx', (req, res) => {
//     const dinosaurs = fs.readFileSync('./dinosaurs.json');
//     const dinasaursArray = JSON.parse(dinosaurs);
    
//     let idx = Number(req.params.idx);
//     const ourDino = dinosaursArray[idx];
    
//     // ourDino.name = req.body.name;
//     // ourDino.type = req.body.type;
    
//     res.render('dinosaurs/edit', { dino: ourDino, idx: idx })
// })

app.put('/dinosaurs/edit/:idx', (req, res) => {
    // the goal of this route is to udate a dinosaur 
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    // set up the index
    let idx = Number(req.params.idx);
    const ourDino = dinosaursArray[idx]; // what datatype is this? object
    // update the dino
    ourDino.name = req.body.name;
    ourDino.type = req.body.type;
    // rewrite file dinosaurs.json
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    // redirect them back to another page (/dinosaurs)
    res.redirect('/dinosaurs');
});


//SHOW VIEW //* 3
app.get('/dinosaurs/:index', (req, res) => {     //! :index will get the dino that's asked for
let dinos = fs.readFileSync('./dinosaurs.json') //! readFileSync will take the infot in dinosaurs.json and then print it on to the page
dinos = JSON.parse(dinos) //! this will take our data and put it into a more readable format 
const dino = dinos[req.params.index]
res.render('dinosaurs/show', { dino }) //? {dino} is the same as saying {dinos: dinos}
})



// POST route, doesn't have a view //* 4. part 2 of the post route

app.post('/dinosaurs', (req, res) => {           //! this is coming from our form submit in new.ejs
    let dinos = fs.readFileSync('./dinosaurs.json')
    dinos = JSON.parse(dinos)
    const newDino = {                   //! when we deal with forms we want to look at !!!__req.body__!!!
        name: req.body.name,
        type: req.body.type
    }
    dinos.push(newDino)                      //*updates our dinos with a new dino
    // JSON.stringify = going to overwrite and turn back into a string
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))
    //* 2 arguments      ⬆️ The path   &   ⬆️ the value that we want to write
    res.redirect('/dinosaurs')                            //* then we get redirected to ➡ ./dinosaurs
    // //console.log(req.body)
})


// PUT & DELETE 2.0
/*
app.delete('/dinosaurs/:idx', (req, res) => {
    let dinosaurs = fs.readFileSync('/dinosaurs.json');
    dinosaurs = JSON.parse(dinosaurs);
    //intermediate variable
    let idx = Number(req.params.idx) //? what is this datatype? comes in as a string then changes into an integer
    
    //* remove the dinosaur
    dinosaurs.splice(idx, 1);
    //?                      ⬆️ this means we ware going to remove one
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs));
    //* 2 arguments      ⬆️ The path   &   ⬆️ the value that we want to write
    res.redirect('/dinosaurs')  
});
*/

app.delete('/dinosaurs/:idx', (req, res) => {
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    // intermediate variable
    let idx = Number(req.params.idx); // what is this datatype? comes in as a string, change to integer
    // remove the dinosaur
    dinosaursArray.splice(idx, 1);
    // save the dinosaurs array into the dinosaurs.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    // redirect back to /dinosaurs route
    res.redirect('/dinosaurs');
});

// app.put('/dinosaurs/:idx', (req, res) => {
//     // the goal of this route is to udate a dinosaur 
//     const dinosaurs = fs.readFileSync('./dinosaurs.json');
//     const dinosaursArray = JSON.parse(dinosaurs);
//     // set up the index
//     let idx = Number(req.params.idx);
//     const ourDino = dinosaursArray[idx]; // what datatype is this? object
//     // update the dino
//     ourDino.name = req.body.name;
//     ourDino.type = req.body.type;
//     // rewrite file dinosaurs.json
//     fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
//     // redirect them back to another page (/dinosaurs)
//     res.redirect('/dinosaurs');
// });

const PORT = process.env.PORT || 8000; //* 1
app.listen(PORT, () => { console.log(`server is running on port ${PORT}🎧`) }); //* 1