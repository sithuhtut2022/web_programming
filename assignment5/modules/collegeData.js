class Data {

    Courses = [];
    Students = [];
    constructor(Courses, Students) {
        this.Courses = Courses;
        this.Students = Students;
    }


}



exports.initialize = function () {
    var dataCollection = new Data(null, null)
    const fs = require('fs')
    studentsFile = process.cwd() + '/data/students.json'
    coursesFile = process.cwd() + '/data/courses.json'




    return new Promise((resolve, reject) => {

        fs.readFile(studentsFile, 'utf8', function (err, data) {
            if (err) {

                reject("Unable to read Student.Json");

            }

            //resolve(data)
            dataCollection.Students = JSON.parse(data);
            fs.readFile(coursesFile, 'utf8', function (err, data) {
                if (err) {

                    reject('Unable to read Course.Json');
                }

                //resolve(data)
                dataCollection.Courses = JSON.parse(data);
                dataCollection = new Data(dataCollection.Courses, dataCollection.Students)
                resolve(dataCollection)


            });


        });
    })


}

exports.getAllStudents = function getAllStudents(dataCollection) {

    return new Promise((resolve, reject) => {

        if (dataCollection.Students.length <= 0) {
            reject('no student data!')
        }

        resolve(dataCollection.Students);


    })


}

exports.getAllCourses = function getAllCourses(dataCollection) {

    return new Promise((resolve, reject) => {

        if (dataCollection.Courses.length <= 0) {
            reject('no Course data!')
        }

        resolve(dataCollection.Courses);


    })


}

exports.getTAs = function getTAs(studentList) {

    let TAList = studentList.filter(function (e) {
        return e.TA == true;
    });
    //console.log(TAList.length)

    return new Promise((resolve, reject) => {

        if (TAList.length <= 0) {
            reject('no student data whose TA property is true !')
        }
        resolve(TAList);


    })
}

exports.getStudentsByCourse = function getStudentsByCourse(studentList, course) {

    let StudentListByCourse = studentList.filter(function (e) {
        return e.course == course;
    });

    return new Promise((resolve, reject) => {

        if (StudentListByCourse.length <= 0) {
            reject('no student data for this course!')
        }

        resolve(StudentListByCourse);
    })
}

exports.getStudentByNum = function getStudentByNum(studentList, studentNum) {

    let StudentListByNum = studentList.filter(function (e) {
        return e.studentNum == studentNum;
    });

    return new Promise((resolve, reject) => {

        if (StudentListByNum.length <= 0) {
            reject('no student data for this student number!')
        }

        resolve(StudentListByNum);
    })
}

exports.getCourseById = function getCourseById(courseList, courseID) {

    let CourseListByID = courseList.filter(function (e) {
        return e.courseId == courseID;
    });

    return new Promise((resolve, reject) => {

        if (CourseListByID.length <= 0) {
            reject('no data for this course ID!')
        }

        resolve(CourseListByID);
    })
}

exports.addStudent = function addStudent(studentCount, newStudentData) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {

        studentsFile = process.cwd() + '/data/students.json'

        studentCount += 1 // get new student number


        let newstudent_obj = {
            "studentNum": studentCount,
            "firstName": newStudentData["firstName"],
            "lastName": newStudentData["lastName"],
            "email": newStudentData["email"],
            "addressStreet": newStudentData["addressStreet"],
            "addressCity": newStudentData["addressCity"],
            "addressProvince": newStudentData["addressProvince"],
            "TA": newStudentData["TA"] ? true : false,
            "status": newStudentData["status"],
            "course": parseInt(newStudentData["course"])
        }



        // Read the JSON file
        const JSONString = fs.readFileSync(studentsFile, "utf8");

        // Parse the JSON file
        const JSData = JSON.parse(JSONString);

        // Add object to the array
        JSData.push(newstudent_obj);

        // Stringify the data
        const newJSONString = JSON.stringify(JSData, null, 2);




        fs.writeFile(studentsFile, newJSONString, function (err, data) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });



}

exports.updateStudent = function updateStudent(updateStudentData) {
    
    const fs = require('fs');
    return new Promise((resolve, reject) => {

        studentsFile = process.cwd() + '/data/students.json'

        // Read the JSON file
        const JSONString = fs.readFileSync(studentsFile, "utf8");
        
        // Parse the JSON file
        const JSData = JSON.parse(JSONString);
        
        // student number key to update json file  
        updateStudentNum = parseInt(updateStudentData["studentNum"])
       
        var index = -1;

        // search index of JSON file to update
        JSData.find(function(item, i){
          if(item.studentNum === updateStudentNum){
            index = i;
            return i;
          }
        });
        
     
        // overwrite the data
      
        JSData[index].firstName = updateStudentData["firstName"];
        JSData[index].lastName = updateStudentData["lastName"];
        JSData[index].email = updateStudentData["email"];
        JSData[index].addressStreet = updateStudentData["addressStreet"];
        JSData[index].addressCity = updateStudentData["addressCity"];
        JSData[index].addressProvince = updateStudentData["addressProvince"];
        JSData[index].TA = updateStudentData["TA"] ? true : false;
        JSData[index].status = updateStudentData["status"];
        JSData[index].course = updateStudentData["course"];


        // Stringify the data
        const newJSONString = JSON.stringify(JSData, null, 2);

        fs.writeFile(studentsFile, newJSONString, function (err, data) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });



}