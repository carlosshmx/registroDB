const express = require('express');
const res = require('express/lib/response');
const router = express.Router();


const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

const locales = [1, 101, 103, 106, 107, 113, 203, 206, 211, 212, 215, 250, 301, 251];


router.get('/', isLoggedIn, async(req, res)=>{
    const listElement = await pool.query('SELECT * FROM dates ORDER BY date DESC')
    res.render('lists/list',{listElement} )
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
            let id_dateArray = await pool.query(`SELECT id FROM dates WHERE date = "${date}"`)
            let id = id_dateArray[0].id
            const listElement = await pool.query('SELECT * FROM locales');

            for(i=0; i<locales.length; i++){
                    const newOperation = { 
                        date: date,
                        operations: null,
                        local: locales[i],
                        box: null, 
                        qty_boxes: null, 
                        id_date: id
                    }; 
            await pool.query('INSERT INTO operations set ?', [newOperation])
            }


            
            res.redirect(`/lists/editlist/${id}`);
        }
        
});

router.get('/editlist/:id', async(req, res) =>{
    const{id}= req.params;
    const locales = await pool.query('SELECT * FROM locales');
    const timestamp = await pool.query(`SELECT date FROM dates WHERE id = ${id}`);
    const data = await pool.query(`SELECT * FROM operations INNER JOIN locales ON operations.local = locales.local WHERE id_date = ${id}`)
    let date = timestamp[0].date;
    
    res.render('lists/editlist',{data, id, date} )
});


router.post('/editlist/:id', async (req, res) => {
    const {id} = req.params;
    const {box, qty_boxes, operations} = req.body;

    for(i=0; i<locales.length; i++){
        let local = locales[i]
        const newOperation = { 
            operations: operations[i]||null,
            box: box[i]||null,
            qty_boxes: qty_boxes[i]||null
        }; 
        await pool.query('UPDATE operations set ? WHERE id_date = ? AND local = ?', [newOperation, id, local]);   
    }
    // console.log(newOperation);

    //     for(i=0; i<locales.length; i++){
    //         const newOperation = { 
    //             operations: operations[i],
    //             box: box[i], 
    //             qty_boxes: qty_boxes[i], 
    //         }; 
    // await pool.query('UPDATE operations set ? WHERE id_date ?', [newOperation, id])
    // }


    // await pool.query('INSERT INTO operations set ?', [newOperation]);
    
    // req.flash('success', 'Link updated successfuly');
    const listElement = await pool.query('SELECT * FROM dates')
    req.flash('success', 'Link updated successfuly');
    res.redirect(`/lists`)

});

router.get('/deletelist/:id', async(req, res) =>{
    const{id}= req.params;
    await pool.query(`DELETE FROM operations WHERE id_date = ${id}`);
    await pool.query(`DELETE FROM dates WHERE id = ${id}`);
    res.redirect(`/lists`);
});

router.get('/searchedlist/:value', async(req, res)=>{
    const{value}= req.params;
    console.log(value)
    const data = await pool.query(`SELECT * FROM operations INNER JOIN locales ON operations.local = locales.local WHERE operations LIKE '%${value}%'`)
    res.render('lists/searchedlists',{data} )
});

router.get('/searchedlist/', async(req, res)=>{
    res.redirect("/lists")
});



module.exports = router;