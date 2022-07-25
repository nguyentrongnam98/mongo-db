const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb,getDb } = require('./db')
const app = express();

app.use(express.json())
let db
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
        console.log('server is running with port 3000');
    })
    db = getDb()
  }
})

app.get('/books', (req,res) => {
    let books = []
    db.collection('book').find().forEach(book => books.push(book)).then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({err:"error"})
    })
})

app.get('/books/:id', (req,res) => {
  if (ObjectId.isValid(req.params.id)) {
     db.collection('book').findOne({_id:ObjectId(req.params.id)}).then(doc => res.status(200).json(doc))
     .catch(err => res.status(500).json({msg:'error'}))
  } else {
    res.status(500).json({msg:"id is not valid"})
  }
})

app.post('/books/add', (req,res) => {
  const book = req.body;
  db.collection('book').insertOne(req.body).then((result) => res.status(200).json(result))
  .catch((err) => res.status(500).json({msg:err}))
})

app.delete('/books/:id', (req,res) => {
  if (ObjectId.isValid(req.params.id)) {
     db.collection('book').deleteOne({_id:ObjectId(req.params.id)}).then((result) => res.status(200).json({msg:'Delete success',result}))
     .catch((err) => res.status(500).json({msg:"Could not delete book"}))
  } else {
    res.status(500).json({msg:'Id is not valid'})
  }
})


app.put("/books/:id", (req,res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('book').updateOne({_id:ObjectId(req.params.id)},{$set:req.body}).then(result => res.status(200).json({msg:"Updated success",result}))
    .catch(err => res.status(500).json({msg:"Could not update the docucment "}))
  } else {
    res.status(500).json({msg:"Id is not valid"})
  }
})