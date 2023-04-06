
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



   } finally {

   }
}
run().catch(err => console.log(err.message))





app.listen(port, () => {
   console.log("server listening on port", port);
})