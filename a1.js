/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Si Thu Htut Student ID:137330213  Date: 20-Jan-2022
*
********************************************************************************/ 

// to display status: 200 is for sucess and 404 is for error
const success_status='200: '
const error_status='404: '

// create arrays and assign the values
var serverVerbs=['GET','GET','GET','POST','GET','POST']
var serverPaths=['/','/about','/contact','/login','/panel','/logout']
var serverResponses=['Welcome to WEB700 Assignment 1','This assignment was prepared by Si Thu','Si Thu: sthtut@myseneca.ca','User Logged In','Main Panel','Logout Complete']

// this function will return a specific "server Response" with the matching "verb" + "path" combination.  
function httpRequest(verb,path){
    var isFound=false // initialize the value

    // error handling for undefined parameters.
    if (typeof verb == 'undefined' || typeof path == 'undefined') {
        return error_status + 'unable to process ' + verb + ' request for ' + path;
    }

    for (let i = 0; i < serverVerbs.length; i++) {
        if (serverVerbs[i].toUpperCase()==verb.trim().toUpperCase() && serverPaths[i].toUpperCase()==path.trim().toUpperCase()){
            isFound=true // if match, change the status to 'Found'
            return success_status + serverResponses[i];
        }
      }

      if (isFound==false){ // if no matching, will disply the message with error status code
        return error_status + 'unable to process ' + verb + ' request for ' + path;
      }

   
}

// testing the "httpRequest" Function
console.log(httpRequest("GET", "/"));
console.log(httpRequest("GET", "/about"));
console.log(httpRequest("PUT", "/")); 
console.log(httpRequest("PUT")); 


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function automateTests(){
    
    // create arrays and assign the values
    var testVerbs=['GET','POST'];
    var testPaths=['/','/about','/contact','/login','/panel','/logout','/randomPath1','/randomPath2'];

    function randomRequest(){

        setInterval(function() {
            randVerb=Math.round(Math.random()); // random index between 0 and 1 inclusive
            randPath=Math.floor(Math.random() * 8); // random index between 0 and 7 inclusive
            console.log(httpRequest(testVerbs[randVerb],testPaths[randPath]))
          }, 1000); //call back every 1sec

    }
    return randomRequest();

}

// invoke the automateTests function
automateTests()