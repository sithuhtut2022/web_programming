class Data {

    Courses = [];
    Students = [];
    constructor(Courses, Students) {
      this.Courses = Courses;
      this.Students = Students;
    }


  }



  exports.initialize=function () {
      var dataCollection=new Data(null,null)
      const fs = require('fs')
      studentsFile=process.cwd()+'/data/students.json'
      coursesFile=process.cwd()+'/data/courses.json'

      


      return new Promise((resolve, reject) => {
    
        fs.readFile(studentsFile, 'utf8', function (err, data) {
            if (err) {

                reject("Unable to read Student.Json");
        
            }

            //resolve(data)
            dataCollection.Students=JSON.parse(data); 
            fs.readFile(coursesFile, 'utf8', function (err, data) {
                if (err) {
    
                    reject('Unable to read Course.Json');
                }
    
                //resolve(data)
                dataCollection.Courses=JSON.parse(data); 
                dataCollection=new Data(dataCollection.Courses,dataCollection.Students)
                resolve(dataCollection)
    
    
            });


        });
    })      


  }

  exports.getAllStudents=function getAllStudents (dataCollection){
       
        return new Promise((resolve, reject) => {

            if (dataCollection.Students.length<=0){
                reject('no student data!')
            }
            
            resolve(dataCollection.Students);

        
        })

   
  }

  exports.getAllCourses=function getAllCourses (dataCollection){
       
    return new Promise((resolve, reject) => {

        if (dataCollection.Courses.length<=0){
            reject('no Course data!')
        }
        
        resolve(dataCollection.Courses);

    
    })


}

  exports.getTAs=function getTAs(studentList){
    
    let TAList = studentList.filter(function (e) {
        return e.TA ==true;
    });
    //console.log(TAList.length)

    return new Promise((resolve, reject) => {

        if (TAList.length<=0){
            reject('no student data whose TA property is true !')
        }
        resolve(TAList);

    
    })
  }