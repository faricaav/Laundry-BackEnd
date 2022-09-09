//import library
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//import model
const model = require('../models/index');
const paket = model.paket
const SECRET_KEY = "UKL Laundry"

//config storage image
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./image")
    },
    filename: (req,file,cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})

//endpoint menampilkan semua data paket, method: GET, function: findAll()
app.get("/", (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
        paket.findAll()
            .then(result => {
                res.json({
                    paket : result 
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

//endpoint menampilkan data paket berdasarkan id, method: GET, function: findOne()
app.get("/:id_paket", (req, res) =>{
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            paket
            .findOne({ where: {id_paket: req.params.id_paket}})
            .then(result => {
                res.json({
                    paket: result
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

app.get("/byOutlet/:id_outlet", async (req, res) => {
    let result =  await paket.findAll({
        where: {id_outlet: req.params.id_outlet},
        include: [
            "outlet",
            {
                model: model.outlet,
                as : "outlet",
            }
        ]
    })
    res.json({
        paket: result
    })
    
})


//endpoint untuk menyimpan data paket, METHOD: POST, function: create
app.post("/", upload.single("image"),  (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            if (!req.file) {
                res.json({
                    message: "No uploaded file"
                })
            } else {        
            let data = {
                id_outlet : req.body.id_outlet,
                jenis : req.body.jenis,
                nama_paket : req.body.nama_paket,
                harga : req.body.harga,
                image: req.file.filename
            }

            paket.create(data)
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
        }
    })
})

//endpoint mengupdate data paket, METHOD: PUT, function:update
app.put("/:id_paket", upload.single("image"), (req,res) => {
    let header = req.headers.authorization
    let token = header && header.split(" ")[1]
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        if(decoded.role=="admin"){
            let param = {
                id_paket : req.params.id_paket
            }
            let data = {
                id_outlet : req.body.id_outlet,
                jenis : req.body.jenis,
                nama_paket : req.body.nama_paket,
                harga : req.body.harga
            }
            if (req.file) {
                // get data by id
                const row = paket.findOne({where: param})
                .then(result => {
                    let oldFileName = result.image
                   
                    // delete old file
                    let dir = path.join(__dirname,"../image",oldFileName)
                    fs.unlink(dir, err => console.log(err))
                })
                .catch(error => {
                    console.log(error.message);
                })
        
                // set new filename
                data.image = req.file.filename
            }
        
            paket.update(data, {where: param})
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

//endpoint menghapus data paket, METHOD: DELETE, function: destroy
app.delete("/:id", async (req, res) => {
    try {
        let param = { id_paket: req.params.id}
        let result = await paket.findOne({where: param})
        let oldFileName = result.image
           
        // delete old file
        let dir = path.join(__dirname,"../image/paket",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        paket.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})


module.exports = app