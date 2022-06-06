const flash = require('connect-flash/lib/flash');
const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index');
});

module.exports = router;

const pool = require('../database');

function inicial(){
    let marca = document.getElementById('marca_selector')
    marca.innerHTML = "<div></div>"
}