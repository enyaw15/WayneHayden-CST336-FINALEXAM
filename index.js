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
/*
const connection = mysql.createConnection({
    host:"localhost",
    user: "enyaw",
    password: "0215Enyaw!",
    database: "quiz_db"
});
*/
//mysql://beb956d049b1b0:4ce83054@us-cdbr-east-06.cleardb.net/heroku_88219e38d1dcf7d?reconnect=true
//reset the database
//mysql -u b081679114026f --password=23b7c662 -h us-cdbr-east-06.cleardb.net heroku_ba1f10e7295fc08 < sql/quiz.sql
//mysql://b081679114026f:23b7c662@us-cdbr-east-06.cleardb.net/heroku_ba1f10e7295fc08?reconnect=true

const connection = mysql.createConnection({
    host:"us-cdbr-east-06.cleardb.net",
    database:"heroku_ba1f10e7295fc08",
    user:"b081679114026f",
    password:"23b7c662"
});
connection.connect();


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
           //randomize answers
           let question = results[0];
           let ans = [];
           ans.push(question.choice1);
           ans.push(question.choice2);
           ans.push(question.choice3);
           ans.push(question.choice4);
           question.choice1 = ans.splice(Math.floor(Math.random()*ans.length),1);//remove one random ans from the ans array and put it back into the question
           question.choice2 = ans.splice(Math.floor(Math.random()*ans.length),1);//remove one random ans from the ans array and put it back into the question
           question.choice3 = ans.splice(Math.floor(Math.random()*ans.length),1);//remove one random ans from the ans array and put it back into the question
           question.choice4 = ans.splice(Math.floor(Math.random()*ans.length),1);//remove one random ans from the ans array and put it back into the question
           resolve(question);
       });
    });
}

//creates the quiz in a random order
async function buildQuiz()
{
    let qs = [];
    qs.push(await getQuestion(1));
    qs.push(await getQuestion(2));
    qs.push(await getQuestion(3));
    return new Promise(function(resolve,reject){
    //random integer from 1 to 3
    let qId = (Math.floor(Math.random()*10) % 3);
    //random number 1 or 0 1 means the next question will be one less 0 means it will be 1 more
    let next = (Math.floor(Math.random()*10) % 2);
    let quiz = [];
    quiz.push(qs[qId]);
    if(next == 0)
    {
        qId++;
        if(qId>2)
        {
            qId = 0;
        }
        quiz.push(qs[qId]);
        qId++;
        if(qId>2)
        {
            qId = 0;
        }
        quiz.push(qs[qId]);
    }
    else
    {
        qId--;
        if(qId<0)
        {
            qId = 2;
        }
        quiz.push(qs[qId]);
        qId--;
        if(qId<0)
        {
            qId = 2;
        }
        quiz.push(qs[qId]);
    }
        resolve(quiz);
    });
}

function isAuthenticated(req, res, next)
{
    if(!req.session.authenticated) res.redirect('/');
    else next();
}

function storeResults(req)
{
    let stmt = "INSERT INTO scores (email, score) VALUES (?,?);";
    return new Promise(function(resolve,reject){
       connection.query(stmt,[req.session.email,req.session.score],function(error,results){
           if(error) throw error;
           resolve(results);
       });
    });
}

function getScores(req)
{
    let stmt = "SELECT score FROM scores WHERE email=?;";
    return new Promise(function(resolve,reject){
       connection.query(stmt,[req.session.email],function(error,results){
           if(error) throw error;
           resolve(results);
       });
    });
}

function getScore(req)
{
    let stmt = "SELECT id, score FROM scores WHERE email=?;";
    return new Promise(function(resolve,reject){
       connection.query(stmt,[req.session.email],function(error,results){
           if(error) throw error;
           resolve(results[results.length-1]);
       });
    });
}

//looks for url matching the string and does the function
// looks for a /
app.get("/", function(req,res){
    res.render("home.ejs",{authenticated:req.session.authenticated,email:req.session.email});
});

app.get("/quiz",isAuthenticated, async function(req, res) {
    if(!req.session.quiz)
    {
        req.session.quiz = (await buildQuiz());
        req.session.q = 0;
        req.session.score = 0;
    }
    if(req.session.q > 2)
    {
        res.redirect("/complete");
    }
    else
    {
        res.render("quiz.ejs", {quiz:req.session.quiz[req.session.q],qNumber:req.session.q,score:req.session.score});
    }
});

app.post("/quiz", async function(req,res){
    let isCorrect = false;
    if(req.body.choice == req.session.quiz[req.session.q].answer)
    {
        req.session.score++;
        isCorrect = true;
    }
    req.session.q++;
    //no more questions
    res.render("answer.ejs",{quiz:req.session.quiz[req.session.q-1],qNumber:req.session.q,score:req.session.score,choice:req.body.choice, isCorrect:isCorrect,});
});

//login routes
app.get("/login", function(req, res){
   res.render("login.ejs"); 
});

app.post("/login", async function(req, res){
    req.session.authenticated = true;
    req.session.email = req.body.email;
    
    res.redirect("/");
    /*
    let users = await checkUsername(req.body.username);
    let hashedPassword = users.length > 0 ? users[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPassword);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = users[0].username;
        req.session.isAdmin = users[0].isAdmin;
        res.redirect('/welcome');
    }
    else{
        res.render('login.ejs', {error: true});
    }
    */
});

//logout route
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.get("/report",isAuthenticated, async function(req, res) {
    let score = await getScore(req);
    if(!score){
        res.redirect("/noquizes");
    }
    else
    {
        res.render("report.ejs",{score:score});
    }
    
});

app.get("/average",isAuthenticated, async function(req, res) {
    let scores = await getScores(req);
    if(scores.length == 0){
        res.redirect("/noquizes");
    }
    else
    {
        res.render("average.ejs",{scores:scores});
    }
});

app.get("/complete",isAuthenticated, async function(req,res)
{
    await storeResults(req);
    delete req.session.quiz;
    res.render("complete.ejs",{score:req.session.score,qNumber:req.session.q});
});

app.get("/noquizes", function(req, res) {
    res.render("noquizes.ejs");
});

// regex star takes everything this should be last so that other options are hit first
app.get("*", function(req, res){
    res.render("error.ejs");
});