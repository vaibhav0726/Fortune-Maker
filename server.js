// require('dotenv').config();
const express = require('express');
// const path = require('path'); // inbuilt in node 
const port = 3000;
const app = express();
// const router = express.Router();
const db = require('./config/mongoose');

// app.use(express.static("assets"));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// for user routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// app.get('/', function(req, res){
//     return res.render('resources');
// });

app.listen(port, function(err){
    if(err){
        console.log("error", err);
        return;
    }
    console.log('server is listening on port', port);
});
