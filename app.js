const http = require("http")

var test = [];
let testId = 1, questionId = 1;
//create a server object:
http.createServer(function (req, res) {
 //res.writeHead(200, {'Content-Type': 'text/html'}); // http header
 var url = req.url;
 console.log('url ', url)
 if(req.method == 'POST') {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        if(body.length == 0 && url != '/user/getAllTest') {
            res.end('wrong data')
            return;
        } 
        if(url != '/user/getAllTest'){
            body = JSON.parse(body)
        }
        if(url ==='/admin/createTest'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(createTest(body));
            res.end(rtn);
        } else if(url ==='/admin/addQuestion'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(addQuestion(body));
            res.end(rtn); //end the response
        } else if(url ==='/admin/publishTest'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(publishTest(body));
            res.end(rtn); //end the response
        } else if(url ==='/admin/getTestByStatus'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(getTestByStatus(body));
            res.end(rtn); //end the response
        } else if(url ==='/user/getAllTest'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(getAllTest());
            res.end(rtn); //end the response
        } else if(url ==='/user/searchTest'){
            res.setHeader('Content-Type', 'application/json');
            let rtn = JSON.stringify(searchTest(body));
            res.end(rtn); //end the response
        } else{
            res.write('<h1>Hello World!<h1>'); //write a response
            res.end(); //end the response
        }
    });
}

}).listen(3100, function(){
 console.log("server start at port 3100"); //the server object listens on port 3000
});

var createTestValidation = function(data) {
    console.log('createTestValidation ', data);
    if(!data.hasOwnProperty("name")){
        return {success:0, message:"test name is mandatory."}
    }
    if(!data.hasOwnProperty("creator")){
        return {success:0, message:"creator name is mandatory."}
    }
    if(!data.hasOwnProperty("company_name")){
        return {success:0, message:"company name is mandatory."}
    }
    if(!data.hasOwnProperty("description")){
        return {success:0, message:"description is mandatory."}
    }
    return {success:1}
}
var createQuestionValidation = function(data) {
    if(!data.hasOwnProperty("testId")){
        return {success:0, message:"testId is mandatory."}
    }
    if(!data.hasOwnProperty("time")){
        return {success:0, message:"time is mandatory."}
    }
    if(!data.hasOwnProperty("question")){
        return {success:0, message:"question is mandatory."}
    }
    if(!data.hasOwnProperty("description")){
        return {success:0, message:"description is mandatory."}
    }
    return {success:1}
}

var createTest = function(data) {
    let validation = createTestValidation(data)
    if(validation.success == 0){
        return validation;
    } else {
        let testObject = {
            id : testId,
            name : data.name,
            creator : data.creator,
            company_name : data.company_name,
            description : data.description,
            test_status:"draft",
            no_of_question:0,
            total_time:0,
            question:[]
        }
        test.push(testObject);
        testId++;
        return {success:1, message:"created test."}
    }
}

var addQuestion = function(data) {
    let validation = createQuestionValidation(data)
    if(validation.success == 0){
        return validation;
    } else {
        test.find(element=> {
            if(element.id == data.testId){
                let question = {
                    id : questionId,
                    description : data.description,
                    time : data.time,
                    question : data.question
                }
                element.total_time = element.total_time + data.time;
                element.question.push(question);
                questionId++;
                return true;
            } else {
                return false;
            }
        });
        return {success1, message: "created question."}
    }
}

var publishTest = function(data) {
    if(!data.hasOwnProperty("testId")){
        return {success:0, message:"testId is mandatory."}
    }
    test.find(element=> {
        if(element.id == data.testId){
            element.test_status = "publish"
            return true;
        } else {
            return false;
        }
    });
    return { success:1}
}
var getTestByStatus = function(data) {
    if(!data.hasOwnProperty("test_status")){
        return {success:0, message:"test_status is mandatory."}
    }
    let rtn = {success : 0, message:"data not found"};
    test.find(element=> {
        if(element.test_status == data.test_status){
            rtn = {success : 1, data : element}
            return true;
        } else {
            return false;
        }
    });
    return rtn;
}
var getAllTest = function() {
    let rtn = [];
    test.forEach(element => {
        console.log('element.test_status ', element.test_status)

        if(element.test_status == "publish"){
            rtn.push(element);
        } 
    });
    return {success:1, data: rtn}
}
var searchTest = function(data) {
    if(!data.hasOwnProperty("search_str")){
        return {success:0, message:"search_str is mandatory."}
    }
    let rtn = [], search_str = data.search_str;
    test.forEach(element => {
        if(element.company_name.includes(search_str) || element.name.includes(search_str)){
            rtn.push(element);
        }
    });
    return {success:1, data:rtn}
}
