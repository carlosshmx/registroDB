const express = require('express');
const res = require('express/lib/response');
const router = express.Router();

router.get('/', async(req, res)=>{
    // const listElement = await pool.query('SELECT * FROM dates')
    res.render('contactlens/selector')
});



module.exports = router;

