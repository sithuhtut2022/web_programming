const Sequelize = require('sequelize');
var sequelize = new Sequelize('d6fgcbb8873qc5', 'kqyzfixaiixzsd', '467f06204e70e2cce08282e177bad67a6517467fe8014a2c7eec9dc60b985263', {
    host: 'ec2-52-201-124-168.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define and create a "Student" model
var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    course: Sequelize.INTEGER
});

// Define and create a "Course" model
var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'course' });

exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        // synchronize the Database with our models and automatically add the 
        // table if it does not exist
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                resolve('Connection has been established successfully.')
            })
            .catch((err) => {
                console.log('unable to sync the database:', err);
                reject("unable to sync the database!");
            });
    });

}


exports.getAllStudents = function getAllStudents(dataCollection) {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            // return all student records
            Student.findAll({
                attributes: ['studentNum', 'firstName', 'lastName', 'email', 'addressStreet', 'addressCity', 'addressProvince', 'TA', 'status', 'course']
            }).then(function (data) {
                console.log("Student records retuned")
                resolve(data)
            })
                .catch((error) => {
                    reject("no results returned!");
                });
        });
    });
}

exports.getStudentsByCourse = function getStudentsByCourse(courseID) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            // return all student records
            Student.findAll({
                attributes: ['studentNum', 'firstName', 'lastName', 'email', 'addressStreet', 'addressCity', 'addressProvince', 'TA', 'status', 'course'],
                where: {
                    course: courseID
                }
            }).then(function (data) {
                console.log("Student by course records retuned")
                resolve(data)
            })
                .catch((error) => {
                    reject("no results returned!");
                });
        });
    });

}


exports.getStudentByNum = function getStudentByNum(studentNum) {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            // return all student records
            Student.findAll({
                attributes: ['studentNum', 'firstName', 'lastName', 'email', 'addressStreet', 'addressCity', 'addressProvince', 'TA', 'status', 'course'],
                where: {
                    studentNum: studentNum
                }
            }).then(function (data) {
                console.log("Student by number records retuned")
                resolve(data)
            })
                .catch((error) => {
                    reject("no results returned!");
                });
        });
    });
}

exports.getCourses = function getCourses() {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            // return all student records
            Course.findAll({
                attributes: ['courseId', 'courseCode', 'courseDescription']
            }).then(function (data) {
                console.log("Course records retuned")
                resolve(data)
            })
                .catch((error) => {
                    reject("no results returned!");
                });
        });
    });
}

exports.getTAs = function getTAs(studentList) {

    return new Promise(function (resolve, reject) {
        reject();
    });

}


exports.getCourseById = function getCourseById(courseId) {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function () {
            // return all student records
            Course.findAll({
                attributes: ['courseId', 'courseCode', 'courseDescription'],
                where: {
                    courseId: courseId
                }
            }).then(function (data) {
                console.log("Course by ID records retuned")
                resolve(data)
            })
                .catch((error) => {
                    reject("no results returned!");
                });
        });
    });
}

exports.addStudent = function addStudent(newStudentData) {
    return new Promise(function (resolve, reject) {
        let newstudent_obj = Student.create({

            "firstName": newStudentData["firstName"] == "" ? null : newStudentData["firstName"],
            "lastName": newStudentData["lastName"] == "" ? null : newStudentData["lastName"],
            "email": newStudentData["email"] == "" ? null : newStudentData["email"],
            "addressStreet": newStudentData["addressStreet"] == "" ? null : newStudentData["addressStreet"],
            "addressCity": newStudentData["addressCity"] == "" ? null : newStudentData["addressCity"],
            "addressProvince": newStudentData["addressProvince"] == "" ? null : newStudentData["addressProvince"],
            "TA": newStudentData["TA"] ? true : false,
            "status": newStudentData["status"],
            "course": newStudentData["course"] == "" ? null : parseInt(newStudentData["course"])

        })


        // insert new student data

        sequelize.sync().then(() => {
            // create a new "student" and add it to the database
            newstudent_obj.then((Student) => {

                console.log("new student registration is successful!")
                resolve("new student registration is successful!")
            }).catch((error) => {
                console.log("unable to create student!");
                reject("unable to create student!");
            });
        });
    });
}

exports.updateStudent = function updateStudent(updateStudentData) {

    return new Promise(function (resolve, reject) {
        let updateStudent_obj = Student.update({
            "firstName": updateStudentData["firstName"] == "" ? null : updateStudentData["firstName"],
            "lastName": updateStudentData["lastName"] == "" ? null : updateStudentData["lastName"],
            "email": updateStudentData["email"] == "" ? null : updateStudentData["email"],
            "addressStreet": updateStudentData["addressStreet"] == "" ? null : updateStudentData["addressStreet"],
            "addressCity": updateStudentData["addressCity"] == "" ? null : updateStudentData["addressCity"],
            "addressProvince": updateStudentData["addressProvince"] == "" ? null : updateStudentData["addressProvince"],
            "TA": updateStudentData["TA"] ? true : false,
            "status": updateStudentData["status"],
            "course": updateStudentData["course"] == "" ? null : parseInt(updateStudentData["course"])
        }, {
            where: {
                studentNum: updateStudentData["studentNum"]
            }
        });


        // update student data

        sequelize.sync().then(() => {
            // update "student"  to the database
            updateStudent_obj.then((Student) => {

                console.log("student registration has been updated!")
                resolve("new student registration has been updated!")
            }).catch((error) => {
                console.log("unable to update student!");
                reject("unable to update student!");
            });
        });
    });
}


exports.addCourse = function addCourse(newCourseData) {

    return new Promise(function (resolve, reject) {

        let newCourse_obj = Course.create({
            "courseCode": newCourseData["courseCode"] == "" ? null : newCourseData["courseCode"],
            "courseDescription": newCourseData["courseDescription"] == "" ? null : newCourseData["courseDescription"],
        })

        // insert new course data

        sequelize.sync().then(() => {
            // create a new "course" and add it to the database
            newCourse_obj.then((Course) => {

                console.log("new course registration is successful!")
                resolve("new course registration is successful!")
            }).catch((error) => {
                console.log("unable to create course!");
                reject("unable to create course!");
            });
        });
    });
}

exports.updateCourse = function updateCourse(updateCourseData) {

    return new Promise(function (resolve, reject) {
        let updateCourse_obj = Course.update({
            "courseCode": updateCourseData["courseCode"] == "" ? null : updateCourseData["courseCode"],
            "courseDescription": updateCourseData["courseDescription"] == "" ? null : updateCourseData["courseDescription"],

        }, {
            where: {
                courseId: updateCourseData["courseId"]
            }
        });


        // edit course data

        sequelize.sync().then(() => {
            // Update "course" record to the database
            updateCourse_obj.then((Course) => {

                console.log("Course registration has been updated!")
                resolve("Course registration has been updated!")
            }).catch((error) => {
                console.log("unable to update course!");
                reject("unable to update course!");
            });
        });
    });
}

exports.deleteCourse = function deleteCourse(courseId) {

    return new Promise(function (resolve, reject) {
        let deleteCourse_obj = Course.destroy({

            where: {
                courseId: courseId
            }
        });


        // delete course data

        sequelize.sync().then(() => {
            // delete "course" record from the database
            deleteCourse_obj.then((Course) => {

                console.log("Selected course has been deleted!")
                resolve("Selected course has been deleted!")
            }).catch((error) => {
                console.log("unable to delete selected course!");
                reject("unable to delete selected course!");
            });
        });
    });
}

exports.deleteStudent = function deleteStudent(studentNum) {

    return new Promise(function (resolve, reject) {
        let deleteStudent_obj = Student.destroy({

            where: {
                studentNum: studentNum
            }
        });


        // delete course data

        sequelize.sync().then(() => {
            // delete "student" record from the database
            deleteStudent_obj.then((Course) => {

                console.log("Selected student has been deleted!")
                resolve("Selected student has been deleted!")
            }).catch((error) => {
                console.log("unable to delete selected student!");
                reject("unable to delete selected student!");
            });
        });
    });
}