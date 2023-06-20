//jshint esversion:6
require('dotenv').config({debug:true})
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const port = 3000;

const mongoose = require('mongoose');
mongoose.connect(process.env.DBSTRING, {useNewUrlParser:true});
const encrypt=require("mongoose-encryption");

let AuthSchema= new mongoose.Schema({
   email: String,
   password:String
})

console.log(process.env.SECRET);
AuthSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['password']} )

const UserModel=mongoose.model("User",AuthSchema)
 
const app = express();
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
 
 app.get("/", function(req,res) {
    res.render("home")
 });

 app.get("/login", function(req,res) {
    res.render("login")
 })

 app.get("/register", function(req,res) {
    res.render("register")
 })


 app.post("/register", async function (req,res) {
    const email=req.body.username;
    const pass=req.body.password;
try {
    const newUser= await new UserModel({
    email:req.body.username,
    password:req.body.password})

    newUser.save();
    res.render("secrets")
    }
    catch (err) {console.log(err);}
 })

 app.post("/login", async function (req,res) {
   let username= req.body.username;
   let password= req.body.password; 

   UserModel.findOne({email : username}).then(function(foundUser,error){
    if(error){
        res.render("login");
        
    }
    else{
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
 }}}})} )
 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});