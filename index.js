
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

app.get('/', function(req, res){
    console.log(req);
    res.send('<h1>cool, it is running!</h1>'); 
}) 

app.listen(port, function(err){
    if(err){
        console.log("error", err);
        return;
    }
    console.log('server is listening on port', port);
})