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
const detail_transaksi = model.detail_transaksi
const SECRET_KEY = "UKL Laundry"

//endpoint menampilkan semua data detail transaksi, method: GET, function: findAll()
app.get("/", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin" || decoded.role=="kasir"){
        detail_transaksi.findAll()
            .then(result => {
                res.json({
                    detail_transaksi : result
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

//endpoint menampilkan data detail transaksi berdasarkan id, method: GET, function: findOne()
app.get("/:id_detail", (req, res) =>{
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin" || decoded.role=="kasir"){
            detail_transaksi
            .findOne({ where: {id_detail: req.params.id_detail}})
            .then(result => {
                res.json({
                    detail_transaksi: result
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

module.exports = app;