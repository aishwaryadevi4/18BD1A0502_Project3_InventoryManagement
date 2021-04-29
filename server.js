const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient =require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/LibraryInventory',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('LibraryInventory');
    app.listen(5000,()=>{
        console.log('Listening at port number 5000');
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home Page
app.get('/',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/addproductpage',(req,res)=>{  
    db.collection('Books').find().toArray((err,result)=>{
        if(err) return console.log(err)  
        res.render('add.ejs',{data:result})
})
})

app.get('/updatestockpage',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('update.ejs',{data:result})
})
})

app.get('/deleteproductpage',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('delete.ejs',{data:result})
})
})

app.post('/add',(req,res)=>{
    db.collection('Books').insertOne(req.body,(err,result)=>{
        if(err) return console.log(err)
        console.log('New product added')
        console.log(req.body)
        res.redirect('/')    
    })
})

app.post('/update',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err)
            return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].BookId==req.body.BookId)
            {
               
                s=result[i].Stock;
                console.log(s)
                break
            }
        }
        db.collection('Books').findOneAndUpdate({BookId:req.body.BookId},{
            $set:{Stock:parseInt(s)+parseInt(req.body.Stock)}},{sort : {_id:-1}},
            (err,result)=>{
                if(err)
                    return res.send(err)
                console.log(req.body.BookId+' stock updated')
                res.redirect('/')
        })
    })
})


app.post('/delete',(req,res)=>{
    db.collection('Books').deleteOne({BookId:req.body.BookId},(err,result)=>{
        if(err)
            return console.log(err)
        console.log("Book No. "+req.body.BookId+"deleted")
        res.redirect('/')
    })
})