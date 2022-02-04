/*********************************************************************************
*  WEB700 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Si Thu Htut Student ID:137330213  Date: 04-Feb-2022
*
********************************************************************************/ 
var collegeData_js=require('./modules/collegeData.js')

let collegeDataCollection;


let promiseA =collegeData_js.initialize()
/*
.then(function(dataCollection){
    
    console.log(dataCollection);
    
})
*/


let promiseB =promiseA.then(collegeData_js.getAllStudents)
let promiseC =promiseB.then(function (studentList){
    
    console.log(`Successfully retrieved ${studentList.length} students`)
    return studentList
    
})
.then(function(dataCollection){
    
    return promiseA
    
})
.then(collegeData_js.getAllCourses)
.then(function (CoureList){
    
    console.log(`Successfully retrieved ${CoureList.length} Courses`);
    
})
.then(function (dataCollection1){
    
    return promiseB
    
})  
.then(collegeData_js.getTAs)
.then(function (TAList){
    
    console.log(`Successfully retrieved ${TAList.length} TA`);
    
})

.catch(function(rejectMsg){
    // catch any errors here
    console.log(rejectMsg);
});


