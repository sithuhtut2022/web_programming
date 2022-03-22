/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __SI THU HTUT_________ Student ID: ___137330213___________ Date: ____2022-03-21____________
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require('express-handlebars');


var app = express();

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});



app.engine('.hbs', exphbs.engine({ extname: '.hbs',
    defaultLayout: 'main',
    helpers: { 
        navLink: function(url, options){
            
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        if: function (value, options) {
            if (value) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
           
           
    }
 }));

app.set('view engine', '.hbs');
app.set('views', './views');



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

            //res.setHeader('Content-Type', "application/json")
            let myJsonString = JSON.stringify(studentList);
            let user = JSON.parse(myJsonString.toString())
            //res.json(user)
            res.render("students", {students: user});
                   
        })
        .catch(function(rejectMsg){
            // catch any errors here
            //res.send(rejectMsg);
            res.render("students", {message: "no results"});
        });
    }
    else{
        let promiseA =collegeData_js.initialize()
        .then(collegeData_js.getAllStudents) 
        .then(function(data){
            return collegeData_js.getStudentsByCourse(data, req.query.course)
        })

        .then(function (StudentListByCourse){
            
            let myJsonString = JSON.stringify(StudentListByCourse);
            let user = JSON.parse(myJsonString.toString())
            //res.json(user)
            res.render("students", {students: user});
            
            
        }) 
        .catch(function(rejectMsg){
            // catch any errors here
            //res.send(rejectMsg);
            res.render("students", {message: "no results"});
        });

    }

});



app.get("/courses", (req, res) => {
    
    let promiseA =collegeData_js.initialize()
   // let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(collegeData_js.getAllCourses)
    .then(function (courseList){

        //res.setHeader('Content-Type', "application/json")
        let myJsonString = JSON.stringify(courseList);
        let user = JSON.parse(myJsonString.toString())
        //res.json(user)
        res.render("courses", {courses: user});
    
    })
    .catch(function(rejectMsg){
        // catch any errors here
        //res.send(rejectMsg);
        res.render("courses", {message: "no results"});
    });
});


app.get("/student/:num", (req, res) => {
    
    let promiseA =collegeData_js.initialize()
    let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(function(data){
        return collegeData_js.getStudentByNum(data, req.params.num)
    })
    let promiseC =promiseB.then(function (studentList){

        //res.setHeader('Content-Type', "application/json")
        let myJsonString = JSON.stringify(studentList);
        let user = JSON.parse(myJsonString.toString())
        if (user)
            user=user[0]
        //res.json(user)
        
        res.render("student", {student: user});
    
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });
});

// get course by ID
app.get("/course/:num", (req, res) => {
    
    let promiseA =collegeData_js.initialize()
    let promiseB =promiseA.then(collegeData_js.getAllCourses)
    .then(function(data){
        return collegeData_js.getCourseById(data, req.params.num)
    })
    let promiseC =promiseB.then(function (courseList){

        //res.setHeader('Content-Type', "application/json")
        let myJsonString = JSON.stringify(courseList);
        let user = JSON.parse(myJsonString.toString())
        //res.json(user)
       if(user)
            user=user[0]
        res.render("course", {course: user});
        
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });
});


// use main.hbs as default template layout
app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname, '/views/home.html'));
    res.render("layouts/home") 
  });



// use main.hbs as default template layout
app.get('/about', function(req, res) {
    //res.sendFile(path.join(__dirname, '/views/about.html'));
    res.render("layouts/about") 
  });

  
//  use main.hbs as default template layout
app.get('/htmlDemo', function(req, res) {
    //res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
    res.render("layouts/htmlDemo") 
  });

//  use main.hbs as default template layout
app.get('/students/add', function(req, res) {
    //res.sendFile(path.join(__dirname, '/views/addStudent.html'));
     res.render("layouts/addStudent") 
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

// POST update student data by student number
  app.post("/student/update", (req, res) => {
    let promiseA =collegeData_js.initialize()
    let promiseB =promiseA.then(collegeData_js.getAllStudents)
    .then(function(data){
        return collegeData_js.updateStudent(req.body)
        
    })
    .catch(function(rejectMsg){
        // catch any errors here
        res.send(rejectMsg);
    });

    res.redirect('/students');
});


  // Handling non matching request from the client
app.use((req, res, next) => {
    res.status(404).send(
        `<h1>404- Page not found on the server.</h1>`)
})



// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});





