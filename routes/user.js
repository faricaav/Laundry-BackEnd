//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const user = model.user

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "UKL Laundry"

app.post("/auth", async (req,res) => {
    let param= {
        username: req.body.username
    }
    let userData = await user.findOne({where: param})

    console.log(userData);

    let data= {
        username: req.body.username,
        password: md5(req.body.password),
        role: userData.role
    }

    let result = await user.findOne({where: data})
    console.log(result)
    if(result){
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }else{
        res.json({
            logged: false,
            message: "Invalid username or password or role"
        })
    }
})


//endpoint menampilkan semua data user, method: GET, function: findAll()
app.get("/", auth, async (req,res) => {
    let result =  await user.findAll({
        include: [
            "outlet",
            {
                model: model.outlet,
                as : "outlet",
            }
        ]
    })
    res.json({
        user: result
    })
})

//endpoint menampilkan data user berdasarkan id, method: GET, function: findOne()
app.get("/:id_user", (req, res) =>{
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            user
            .findOne({ where: {id_user: req.params.id_user}})
            .then(result => {
                res.json({
                    user: result
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
        }
    })
})

//endpoint untuk menyimpan data user, METHOD: POST, function: create
app.post("/", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let data = {
                nama : req.body.nama,
                username : req.body.username,
                password : md5(req.body.password),
                id_outlet : req.body.id_outlet,
                role : req.body.role
            }

            user.create(data)
                .then(() => {
                    res.json({
                        message: "data has been inserted"
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        }
    })
})

//endpoint mengupdate data user, METHOD: PUT, function:update
app.put("/:id_user", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let param = {
                id_user : req.params.id_user
            }
            let data = {
                nama : req.body.nama,
                username : req.body.username,
                password : md5(req.body.password),
                id_outlet : req.body.id_outlet,
                role : req.body.role
            }
            user.update(data, {where: param})
                .then(() => {
                    res.json({
                        message: "data has been updated"
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        }
    })
})

//endpoint menghapus data user, METHOD: DELETE, function: destroy
app.delete("/:id_user", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let param = {
                id_user : req.params.id_user
            }
            user.destroy({where: param})
                .then(() => {
                    res.json({
                        message: "data has been deleted"
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        }
    })
})

module.exports = app