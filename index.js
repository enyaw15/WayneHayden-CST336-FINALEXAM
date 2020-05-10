var express = require("express");//import express
var mysql = require("mysql");//require my sql
var session = require('express-session');//require sessions
var bodyParser = require("body-parser");//used for form input
var app = express();//create an app
//uses
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));//public folder can be staticly referenced
app.use(session({
    secret:"this is the secret key",
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');//set the view engine so we can use ejs

//create sql server 
const connection = mysql.createConnection({
    host:"localhost",
    user: "enyaw",
    password: "0215Enyaw!",
    database: "quiz_db"
});
//mysql://beb956d049b1b0:4ce83054@us-cdbr-east-06.cleardb.net/heroku_88219e38d1dcf7d?reconnect=true
//reset the database
//mysql -u beb956d049b1b0 --password=4ce83054 -h us-cdbr-east-06.cleardb.net heroku_88219e38d1dcf7d < sql/initdbs.sql
/*
const connection = mysql.createConnection({
    host:"us-cdbr-east-06.cleardb.net",
    database:"heroku_88219e38d1dcf7d",
    user:"beb956d049b1b0",
    password:"4ce83054"
})
connection.connect();
*/

//start the app listening on a port and do a function
app.listen(process.env.PORT, function()
{
    console.log("server active");
});

function getQuestion(qId){
    let stmt = "SELECT * FROM questions WHERE id = ?";
    return new Promise(function(resolve,reject){
       connection.query(stmt,[qId],function(error, results) {
           if(error) throw error;
           resolve(results);
       });
    });
}
//looks for url matching the string and does the function
// looks for a /
app.get("/", function(req,res){
    res.render("home.ejs");
});


app.get("/quiz", async function(req, res) {
    let quiz = await getQuestion(1);
    res.render("quiz.ejs", {quiz:quiz[0]});
});

app.post("/quiz", async function(req,res){
    console.log(req.body);    
    console.log(req.body.choice);    
    res.redirect("/quiz");
});


// regex star takes everything this should be last so that other options are hit first
app.get("*", function(req, res){
    res.render("error.ejs");
});