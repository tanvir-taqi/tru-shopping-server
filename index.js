
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application, query } = require('express');
require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()


app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
   res.send("welcome to tru shopper server!")
})




const uri = process.env.DB_ACCESS
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   if (err) {
      console.log(err.message);
   } else {
      console.log("database connection established");
   }
});



const run = async () => {
   try {

      const productscollection = client.db('trushopping').collection('products')
      const orderscollection = client.db('trushopping').collection('orders')

      // all products get requests

      app.get('/products', async (req, res) => {
         const query = {}
         let results
         if (!req.query.limit) {
            results = await productscollection.find(query).toArray()
         } else {
            const limit = parseInt(req.query.limit)
            results = await productscollection.find(query).limit(limit).toArray()
         }
         res.send(results)
      })

      // single product get request 
      app.get('/products/:id', async (req, res) => {
         const query = { _id: ObjectId(req.params.id) }
         const results = await productscollection.findOne(query)
         res.send(results)
      })


      // add products to prodduct collection

      app.post('/products', async (req, res) => {
         const product = req.body
         const result = await productscollection.insertOne(product)
         res.send(result)
      })


      //  stock update api
      app.put('/products/:id', async (req, res) => {
         const products = req.params.id;
         const stock = req.body.stock;

         const filter = { _id: ObjectId(products) }
         const options = { upsert: true }
         const updatedDoc = {
            $set: {
               stock: stock
            }
         }
         const result = await productscollection.updateOne(filter, updatedDoc, options)

         res.send(result)
      })

      //delete product
      app.delete('/product/:id', async (req, res) => {
         const query = { _id: ObjectId(req.params.id) }
         const results = await productscollection.deleteOne(query)
         res.send(results)
      })

      // post orders 
      app.post('/orders', async (req, res) => {
         const order = req.body

         const results = await orderscollection.insertOne(order)
         res.send(results)
      })

      // get all orders
      app.get('/orderlist', async (req, res) => {
         const query = {}
         results = await orderscollection.find(query).sort({date:-1}).toArray()
         res.send(results)
      })

      //update order status
      app.put('/orderlist/:id', async (req, res) => {
         const orderID = req.params.id;
         const orderData = req.body.status;
         console.log('====================================');
         console.log(orderData);
         console.log('====================================');
         const filter = { _id: ObjectId(orderID) }
         const options = { upsert: true }
         const updatedDoc = {
            $set: {
               status: orderData
            }
         }
         const result = await orderscollection.updateOne(filter, updatedDoc, options)

         res.send(result)
      })

   } finally {

   }
}
run().catch(err => console.log(err.message))





app.listen(port, () => {
   console.log("server listening on port", port);
})