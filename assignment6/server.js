/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
<<<<<<< HEAD
*  Name: __SI THU HTUT_________ Student ID: ___137330213___________ Date: ____2022-04-05____________
=======
*  Name: __SI THU HTUT_________ Student ID: ___137330213___________ Date: ____2022-04-04____________
>>>>>>> 374ec41eb8b3ffe6327e278033e01bb7fbf8377a
*   Online (Heroku) Link:  https://salty-plains-86886.herokuapp.com/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require('express-handlebars');

var app = express();

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});



app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {

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

var collegeData_js = require('./modules/collegeData.js')


// setup a 'route' to listen on the default url path
app.get("/students", (req, res) => {

    // check for query string
    if (!req.query.course) {
        let promiseA = collegeData_js.initialize()
        let promiseB = promiseA.then(collegeData_js.getAllStudents)
        let promiseC = promiseB.then(function (studentList) {
            if (studentList.length > 0) {
                //res.setHeader('Content-Type', "application/json")
                let myJsonString = JSON.stringify(studentList);
                let user = JSON.parse(myJsonString.toString())
                //res.json(user)

                res.render("students", { students: user });
            }
            else {
                res.render("students", { message: "no results" });
            }



        })
            .catch(function (rejectMsg) {
                // catch any errors here
                //res.send(rejectMsg);
                res.render("students", { message: "no results" });
            });
    }
    else {
        let promiseA = collegeData_js.initialize()
            //.then(collegeData_js.getAllStudents) 
            .then(function (data) {
                return collegeData_js.getStudentsByCourse(req.query.course)
            })

            .then(function (StudentListByCourse) {
                if (StudentListByCourse.length > 0) {
                    let myJsonString = JSON.stringify(StudentListByCourse);
                    let user = JSON.parse(myJsonString.toString())
                    //res.json(user)
                    console.log(StudentListByCourse.length)
                    res.render("students", { students: user });
                }
                else {
                    res.render("students", { message: "no results" });
                }

            })
            .catch(function (rejectMsg) {
                // catch any errors here
                //res.send(rejectMsg);
                res.render("students", { message: "no results" });
            });

    }

});



app.get("/courses", (req, res) => {

    let promiseA = collegeData_js.initialize()
        // let promiseB =promiseA.then(collegeData_js.getAllStudents)
        .then(collegeData_js.getCourses)
        .then(function (courseList) {
            if (courseList.length > 0) {
                //res.setHeader('Content-Type', "application/json")
                let myJsonString = JSON.stringify(courseList);
                let user = JSON.parse(myJsonString.toString())
                //res.json(user)
                res.render("courses", { courses: user });
            }
            else {
                res.render("courses", { message: "no results" });
            }
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            //res.send(rejectMsg);
            res.render("courses", { message: "no results" });
        });
});


app.get("/student/:num", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    collegeData_js.getStudentByNum(req.params.num).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(collegeData_js.getCourses)
        .then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"

            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching 
            // viewData.courses object

            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }



        }).catch(() => {
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {

            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                console.log(viewData)
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
});


// get course by ID
app.get("/course/:num", (req, res) => {

    let promiseA = collegeData_js.initialize()
        //let promiseB =promiseA.then(collegeData_js.getAllCourses)
        .then(function (data) {
            return collegeData_js.getCourseById(req.params.num)
        })
        .then(function (courseList) {

            if (typeof courseList == 'undefined' || courseList.length < 1) {
                res.status(404).send("Course Not Found")
            }
            else {
                //res.setHeader('Content-Type', "application/json")
                let myJsonString = JSON.stringify(courseList);
                let user = JSON.parse(myJsonString.toString())
                //res.json(user)
                if (user)
                    user = user[0]
                res.render("course", { course: user });
            }
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.send(rejectMsg);
        });
});


// use main.hbs as default template layout
app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, '/views/home.html'));
    res.render("layouts/home")
});



// use main.hbs as default template layout
app.get('/about', function (req, res) {
    //res.sendFile(path.join(__dirname, '/views/about.html'));
    res.render("layouts/about")
});


//  use main.hbs as default template layout
app.get('/htmlDemo', function (req, res) {
    //res.sendFile(path.join(__dirname, '/views/htmlDemo.html'));
    res.render("layouts/htmlDemo")
});

//  use main.hbs as default template layout
app.get('/students/add', function (req, res) {
    let promiseA = collegeData_js.initialize()
        .then(collegeData_js.getCourses)
        .then(function (courseList) {
            if (courseList.length > 0) {
                let myJsonString = JSON.stringify(courseList);
                let user = JSON.parse(myJsonString.toString())
                res.render("layouts/addStudent", { courses: user });
            }
            else {
                res.render("layouts/addStudent", { courses: [] });
            }
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.render("layouts/addStudent", { courses: [] });
        });
});


// POST /api/users gets JSON bodies
app.post('/students/add', function (req, res) {

    let promiseA = collegeData_js.initialize()
        //let promiseB =promiseA.then(collegeData_js.getAllStudents)
        .then(function (data) {
            return collegeData_js.addStudent(req.body)

        })
        .then(function (data) {
            res.redirect('/students');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.send(rejectMsg);
        });
})

// POST update student data by student number
app.post("/student/update", (req, res) => {
    let promiseA = collegeData_js.initialize()
        //let promiseB =promiseA.then(collegeData_js.getAllStudents)
        .then(function (data) {
            return collegeData_js.updateStudent(req.body)

        })
        .then(function (data) {
            res.redirect('/students');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.send(rejectMsg);
        });

});

//  use main.hbs as default template layout
app.get('/courses/add', function (req, res) {

    res.render("layouts/addCourse")
});


// POST /api/users gets JSON bodies
app.post('/courses/add', function (req, res) {

    let promiseA = collegeData_js.initialize()
        .then(function (data) {
            return collegeData_js.addCourse(req.body)

        })
        .then(function (data) {
            res.redirect('/courses');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.send(rejectMsg);
        });
})

// POST update course data by course id
app.post("/courses/update", (req, res) => {
    let promiseA = collegeData_js.initialize()
        .then(function (data) {
            return collegeData_js.updateCourse(req.body)

        })
        .then(function (data) {
            res.redirect('/courses');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.send(rejectMsg);
        });
});

// delete course by ID
app.get("/course/delete/:id", (req, res) => {

    let promiseA = collegeData_js.initialize()
        .then(function (data) {
            return collegeData_js.deleteCourse(req.params.id)
        })
        .then(function (data) {
            res.redirect('/courses');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.status(500).send("Unable to Remove Course / Course not found")
        });
});


// delete course by ID
app.get("/student/delete/:studentNum", (req, res) => {

    let promiseA = collegeData_js.initialize()
        .then(function (data) {
            return collegeData_js.deleteStudent(req.params.studentNum)
        })
        .then(function (data) {
            res.redirect('/students');
        })
        .catch(function (rejectMsg) {
            // catch any errors here
            res.status(500).send("Unable to Remove student / student not found")
        });
});

// Handling non matching request from the client
app.use((req, res, next) => {
    res.status(404).send(
        `<h1>404- Page not found on the server.</h1>`)
})

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });





