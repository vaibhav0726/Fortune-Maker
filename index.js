require('dotenv').config();
const express = require('express');
const path = require('path'); // inbuilt in node 
const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

app.use( express.static( "views" ));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res){
    // console.log(req);
    // console.log(__dirname); // directory where index.js is located and started
    // res.send('<h1>it is running!</h1>');
    return res.render('resources');
}) 

app.get('/temp', function(req, res){
    return res.render('temp');
}) 

app.listen(port, function(err){
    if(err){
        console.log("error", err);
        return;
    }
    console.log('server is listening on port', port);
})
