//import library
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const member = model.member;
const SECRET_KEY = "UKL Laundry"

//endpoint menampilkan semua data member, method: GET, function: findAll()
app.get("/", (req, res) => {
  let header = req.headers.authorization
  let token = header && header.split(" ")[1]
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.role=="kasir" || decoded.role=="admin"){
      member
      .findAll()
      .then((result) => {
        res.json({
          member: result,
        })
      })
      .catch((error) => {
        res.json({
          message: error.message,
        })
      })
    }
  })
})

//endpoint menampilkan data member berdasarkan id, method: GET, function: findOne()
app.get("/:id_member", (req, res) =>{
  let header = req.headers.authorization
  let token = header && header.split(" ")[1]
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.role=="kasir" || decoded.role=="admin"){

      member
      .findOne({ where: {id_member: req.params.id_member}})
      .then(result => {
          res.json({
              member: result
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

//endpoint untuk menyimpan data member, METHOD: POST, function: create
app.post("/", (req, res) => {
  let header = req.headers.authorization
  let token = header && header.split(" ")[1]
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.role=="kasir" || decoded.role=="admin"){

    let data = {
      nama: req.body.nama,
      alamat: req.body.alamat,
      jenis_kelamin: req.body.jenis_kelamin,
      tlp: req.body.tlp,
    };

    member
      .create(data)
      .then(() => {
        res.json({
          message: "data has been inserted",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
    }
  })
});

//endpoint mengupdate data member, METHOD: PUT, function:update
app.put("/:id_member", (req, res) => {
  let header = req.headers.authorization
  let token = header && header.split(" ")[1]
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.role=="kasir" || decoded.role=="admin"){

    let param = {
      id_member: req.params.id_member,
    };
    let data = {
      nama: req.body.nama,
      alamat: req.body.alamat,
      jenis_kelamin: req.body.jenis_kelamin,
      tlp: req.body.tlp,
    };

    member
      .update(data, { where: param })
      .then(() => {
        res.json({
          message: "data has been updated",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
    }
  })
});

//endpoint menghapus data member, METHOD: DELETE, function: destroy
app.delete("/:id_member", (req, res) => {
  let header = req.headers.authorization
  let token = header && header.split(" ")[1]
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if(decoded.role=="kasir" || decoded.role=="admin"){

    let param = {
      id_member: req.params.id_member,
    };
    member
      .destroy({ where: param })
      .then(() => {
        res.json({
          message: "data has been deleted",
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
    }
  })
});

module.exports = app;
