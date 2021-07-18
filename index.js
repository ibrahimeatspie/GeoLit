const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var io = require('socket.io')(server);



app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});



const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ibrahimthespy:Y1rQI8wj9cQdYZ0M@cluster0.hrmmc.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const d = new Date();
                let year = d.getFullYear();
                let month = d.getMonth()+1;
                let date = d.getDate()-1;
                let hours = d.getHours();
                let minutes = d.getMinutes();
                let seconds = d.getSeconds();

                let currDate = month + "/" + date + "/" + year;
let features = [];

let data = {};


/*app.get("/delete", (req, res) => {
    var wee = {
        id: req.query.id
    };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db("Cluster0")
        dbo.collection('articles', function(err, collection) {
            collection.deleteOne({
                _id: new mongodb.ObjectID(wee.id)
            });
        });




    });


})*/


//On startup
MongoClient.connect(uri, function(err, db) {

if (err) throw err
        var dbo = db.db("Cluster0")
      dbo.collection("articles").find({}, /*{ projection: {_id: 0}}*/).toArray(function(err, result) {
          //console.log(result);
            if (err) throw err;
            data=result;

              



            //console.log(data[0]._id.substring(13))
             db.close();
        });


});




/*MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Cluster0");
  
  dbo.collection("articles").deleteMany(function(err, obj) {
    if (err) throw err;
    console.log( " document(s) deleted");
    db.close();
  });
});
*/

io.on('connection', (socket) => {
    //console.log("connection created");
      socket.on('test', (data)=>{
        console.log("iphone has clicked button");
      })


      socket.on('requestFeatures', (bruh)=>{
        //console.log(data);
        socket.emit('sendingFeatures', data);

      })

      socket.on('pointInsertion', (feature)=>{
        console.log("Button has been clicked")
        data.push(feature);
        //console.log(features);
       // console.log("----------------------")


        MongoClient.connect(uri, function(err, db) {
          if (err) throw err
          var dbo = db.db("Cluster0")
                 
              dbo.collection("articles").insertOne(feature, function(err, res) {
                  console.log("Document inserted");
                  if (err) throw err
                  db.close();
              })
                  });

      })   
});



server.listen(3000, () => {
    console.log('server started');
});

