const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/dssfs';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});



const dbo = mongoose.connection;
dbo.on('error', console.error.bind(console, 'connection error:'));
dbo.once('open', function() {
    console.log("Database is connected connected")
  // we're connected!
});

//Schema defined
const data = new mongoose.Schema({
    
    person_name: String,
    contact_number: Number
})

//collection created
const Contact = new mongoose.model("contact",data);

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/assets',express.static(__dirname +'/public'));

app.get('/',(req, res)=> {
  var mysort = {name: 1};
  dbo.collection("contact").find().sort(mysort).toArray(function(err,result){
    if(err) throw err;
res.render("contact_view",{results:result})
});
});

app.post('/savecontact',(req, res)=> {
  let data = {person_name:req.body.name,contact_number: req.body.number};
     dbo.collection("contact").insertOne(data,function(err,res){
        if(err) throw err;
        console.log("1 record inserted");
    });
    res.redirect("/");
  });

  app.get('/contactadd',(req, res)=>{
    res.render("contact_a");
  });

  app.get('/contactdelete/:name',(req, res)=>  {
    const name=req.params.name;
    console.log(name);
    var myquery = {person_name:name}
    dbo.collection("contact").deleteOne(myquery, function(err,result){
        if(err) throw err;
        console.log("1 document deleted");
           });
           res.redirect("/");
    });

    app.get('/contactedit/:name',(req, res)=> {
      const name=req.params.name;
      console.log(name);
      var obj = {"person_name": name};
      dbo.collection("contact").findOne(obj,function(err,result){
        if(err) throw err;
        console.log(result.person_name);
        res.render('contact_edit',{
        results: result
      });
      });
      });

      app.post('/updatecontact', (req,res)=>{
        let data ={person_name: req.body.name, contact_number: req.body.number};
        var myquery = {person_name: req.body.name};
        var newvalues = {$set: {person_name: req.body.name, contact_number: req.body.number}};
         dbo.collection("contact").updateOne(myquery, newvalues, function(err,res){
             if(err) throw err;
             console.log("1 document updated");
         });
         res.redirect("/");
  });

 
app.listen(8000, () =>{
  console.log('Server is running at port 8000');
});
