const express = require('express');
const res = require('express/lib/response');
const router = express.Router();


const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

const locales = [1, 101, 103, 106, 107, 113, 203, 206, 211, 212, 215, 216, 301];


router.get('/', isLoggedIn, async(req, res)=>{
    const listElement = await pool.query('SELECT * FROM dates')
    res.render('lists/list',{listElement} )
    // const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id])
    // res.render('links/list', { links });
});

router.get('/addlist', async(req, res) =>{
    // const listElement = await pool.query('SELECT * FROM locales');
    res.render('lists/addlist');
});



router.post('/addlist', async(req, res) =>{
    const {date, operator } = req.body;
    // console.log(date);
    // console.log(operator);
    const newDate ={
        date, 
        operator
    };
    
    const finded = await pool.query(`SELECT * FROM dates WHERE date = "${date}"`)
    // console.log(finded)

    if(finded[0]){
            req.flash('message', 'Fecha ya creada');
            res.redirect('/lists/addlist');
        }else{
            await pool.query('INSERT INTO dates set ?', [newDate]);
            let id_date = await pool.query(`SELECT id FROM dates WHERE date = "${date}"`)
            console.log(id_date[0].id);
            const listElement = await pool.query('SELECT * FROM locales');
            res.render('lists/editlist',{listElement, id_date, date} )
        }
        
});

router.get('/editlist/:id', async(req, res) =>{
    const{id}= req.params;
    const listElement = await pool.query('SELECT * FROM locales');
    const timestamp = await pool.query(`SELECT date FROM dates WHERE id = ${id}`);
    let date = timestamp[0].date;
    res.render('lists/editlist',{listElement, id, date} )
});


router.post('/editlist/:id', async (req, res) => {
    const {id} = req.params;
    const {local, box, qty_boxes, operations} = req.body;

    for(i=1; i<=13; i++){
        const newOperation = { 
            box: box[i], 
            qty_boxes: qty_boxes[i], 
            operations: operations[i],
            id_date: id,
            local: locales[i-1]
        };
        console.log(newOperation);
        await new Promise((resolve, reject) => {
            resolve(pool.query('INSERT INTO operations set ?', [newOperation]))
         
        });
    }

    

    // await pool.query('INSERT INTO operations set ?', [newOperation]);
    
   
    // await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    // req.flash('success', 'Link updated successfuly');
    const listElement = await pool.query('SELECT * FROM dates')
    res.render('lists/list',{listElement})

});

module.exports = router;