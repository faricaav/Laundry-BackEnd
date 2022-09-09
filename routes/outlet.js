//import library
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const outlet = model.outlet
const SECRET_KEY = "UKL Laundry"

//endpoint menampilkan semua data outlet, method: GET, function: findAll()
app.get("/", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            outlet.findAll()
                .then(result => {
                    res.json({
                        outlet : result
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

//endpoint menampilkan data outlet berdasarkan id, method: GET, function: findOne()
app.get("/:id_outlet", (req, res) =>{
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            outlet
            .findOne({ where: {id_outlet: req.params.id_outlet}})
            .then(result => {
                res.json({
                    outlet: result
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

//endpoint untuk menyimpan data outlet, METHOD: POST, function: create
app.post("/", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let data = {
                nama : req.body.nama,
                alamat : req.body.alamat,
                tlp : req.body.tlp
            }

            outlet.create(data)
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

//endpoint mengupdate data outlet, METHOD: PUT, function:update
app.put("/:id_outlet", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let param = {
                id_outlet : req.params.id_outlet
            }
            let data = {
                nama : req.body.nama,
                alamat : req.body.alamat,
                tlp : req.body.tlp
            }
            outlet.update(data, {where: param})
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

//endpoint menghapus data outlet, METHOD: DELETE, function: destroy
app.delete("/:id_outlet", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let param = {
                id_outlet : req.params.id_outlet
            }
            outlet.destroy({where: param})
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