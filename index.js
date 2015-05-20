var app = require('./server/server.js');


var port = process.env.PORT || 8000;
app.listen(port);
console.log('RaiseYourHand Now running on ----> ' + port);

