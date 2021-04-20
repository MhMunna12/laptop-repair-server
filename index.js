const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwuix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json())
app.use(cors())
const port = 6060

const ObjectId = require('mongodb').ObjectID;

app.get('/', (req, res) => {
  res.send('Hi Munna !!! Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("laptopRepair").collection("services");
  const servicesOrderCollection = client.db("laptopRepair").collection("orders");
  const reviewCollection = client.db("laptopRepair").collection("review");
  const engineersCollection = client.db("laptopRepair").collection("engineer");
  const adminCollection = client.db("laptopRepair").collection("admin");
  
    //service part start
    app.get('/services', (req,res) =>{
      servicesCollection.find()
      .toArray((err, items) =>{
        res.send(items);
      })
    })

    app.get('/service/:id', (req, res)=>{
      const id = ObjectId(req.params.id)
      console.log(id);
      servicesCollection.find({_id: id})
      .toArray((err, documents)=>{
        res.send(documents[0])
      })
    })

    app.post('/addServices',(req,res) => {
      const service = req.body;
      console.log(service);
      servicesCollection.insertOne(service)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteService/:id', (req,res) =>{
    const id = ObjectId(req.params.id)
    servicesCollection.deleteOne({_id: id})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

  //service part end

  //order part start

    app.post('/addServicesOrders',(req,res) => {
      const order = req.body;
      console.log(order);
      servicesOrderCollection.insertOne(order)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/serviceOrder', (req,res) =>{
    servicesOrderCollection.find({email: req.query.email})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/orderList', (req,res) =>{
    servicesOrderCollection.find()
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  //update

  app.patch('/update/:itemId', (req, res) => {
    const id = req.params.itemId;
    servicesOrderCollection.updateOne({ _id: ObjectId(id) }, {
      $set: { status: req.body.value }
    })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })

//order part end

//admin part start
app.post('/addAdmin', (req,res) =>{
  const admin = req. body;
  adminCollection.insertOne(admin)
  .then(result =>{
    res.send(result.insertedCount > 0)
  })
})

app.post('/admin', (req,res) =>{
  const email = req.body.email;
  adminCollection.find({email: email})
  .toArray((err, documents) =>{
    res.send(documents.length > 0);
  })
})



//admin part end


//review part start
  app.get('/reviews',(req, res) =>{
    reviewCollection.find()
    .toArray((err, review) =>{
      res.send(review)
    })
  })

  app.post('/addReview', (req,res) =>{
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

  //engineers part start

  app.post('/addEngineers', (req,res) =>{
    const engineer = req.body
    engineersCollection.insertOne(engineer)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/engineers', (req,res)=>{
    engineersCollection.find()
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })

  //engineers part end
  
});


app.listen(process.env.PORT || port)