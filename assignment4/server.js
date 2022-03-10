/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __SI THU HTUT_________ Student ID: ___137330213___________ Date: ____2022-03-10____________
*   Online (Heroku) Link:  https://sithuhtut-seneca.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");

var app = express();

// create body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set the  folder as static in order to access images files in html pages
app.use(express.static(__dirname));



const path = require('path');

var collegeData_js=require('./modules/collegeData.js')

// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {
    
    // check for query string
    if (!req.query.course){
        let promiseA =collegeData_js.initialize()
        let promiseB =promiseA.then(collegeData_js.getAllStudents)
        let promiseC =promiseB.then(function (studentList){

            res.setHeader('Content-Type', "application/json")
            let myJsonString = JSON.stringify(studentList);
            let user = JSON.parse(myJsonString.toString())
            res.json(user)
        
        })
        .catch(function(rejectMsg){
            // catch any errors here
            res.send(rejectMsg);
        });
    }
    else{
        let promiseA =collegeData_js.initialize()
        .then(collegeData_js.getAllStudents) 
        .then(function(data){
            return collegeData_js.getStudentsByCourse(data, req.query.course)
        })

        .then(function (StudentListByCourse){
            res.setHeader('Content-Type', "application/json")
            let myJsonString = JSON.stringify(StudentListByCourse);
            let user = JSON.parse(myJsonString.toString())
            res.json(user)
            
            
        }) 
        .catch(function(rejectMsg){
            // catch any errors here
            res.send(rejectMsg);
        });

    }

});

app.get("/tas", (req, res) => {
    
        let promiseA =collegeData_js.initialize()
        let promiseB =promiseA.then(collegeData_js.getAllStudents)
        .then(collegeData_js.getTAs)
        let promiseC =promiseB.then(function (studentList){

            res.setHeader('Content-Type', "application/json")
            let myJsonString = JSON.stringify(studentList);
            let user = JSON.parse(myJsonString.toString())
            res.json(user)
        
        })
        .catch(function(rejectMsg){
            // catch any errors here
            res.send(rejectMsg);
        });
});

app.get("/courses", (req, res) => {
    
    let promiseA =collegeData_js.initialize()
   // let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(collegeData_js.getAllCourses)
    .then(function (courseList){

        res.setHeader('Content-Type', "application/json")
        let myJsonString = JSON.stringify(courseList);
        let user = JSON.parse(myJsonString.toString())
        res.json(user)
    
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });
});


app.get("/student/:num", (req, res) => {
    
    let promiseA =collegeData_js.initialize()
    let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(function(data){
        return collegeData_js.getStudentByNum(data, req.params.num)
    })
    let promiseC =promiseB.then(function (studentList){

        res.setHeader('Content-Type', "application/json")
        let myJsonString = JSON.stringify(studentList);
        let user = JSON.parse(myJsonString.toString())
        res.json(user)
    
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });
});

// redirect home.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/home.html'));
  });

// redirect about.html
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/about.html'));
  });

  
// redirect htmlDemo.html
app.get('/htmlDemo', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
  });

// redirect htmlDemo.html
app.get('/students/add', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/addStudent.html'));
  });


  // POST /api/users gets JSON bodies
app.post('/students/add', function (req, res) {
   
    let promiseA =collegeData_js.initialize()
    let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(function(data){
        return collegeData_js.addStudent(data.length, req.body)
        
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });

    res.redirect('/students');
  })

  // Handling non matching request from the client
app.use((req, res, next) => {
    res.status(404).send(
        `<h1>404- Page not found on the server.</h1>`)
})



// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});





