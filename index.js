const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { options } = require("nodemon/lib/config");
const uri = `mongodb+srv://equip_manufacturer:Jq0ppy2tBe16fi61@cluster0.a3zpv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const useCollection = client
      .db("equipment_manufacturer")
      .collection("users");
    app.get('/user', async (req,res)=>{
      const users = await useCollection.find().toArray();
      res.send(users);
    })
    //make admin
    app.put("/user/admin/:email", async (req,res)=>{
      const email = req.params.email;
      const filter = {email: email};
      const updateDoc = {
        $set: {role: "admin"}
      }
      const result = await useCollection.updateOne(filter,updateDoc);
      res.send(result)
    })
    //make admin
    app.put("/user/nUser/:email", async (req,res)=>{
      const email = req.params.email;
      const filter = {email: email};
      const updateDoc = {
        $set: {role: "user"}
      }
      const result = await useCollection.updateOne(filter,updateDoc);
      res.send(result)
    })
    //store users
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await useCollection.updateOne(filter, updateDoc, options);
      // const token = jwt.sign(
      //   { email: email },
      //   "e9763359c7356dccaba507fb6fa486b1d2d920e7837dace41bde58d80eaefe7cb16abcfdba125eb92fb7b55d3e400a646a04c0e989bbf7cb9b1ea714ed8a986d",
      //   { expiresIn: "30s" }
      // );
      // console.log(token, "token");
      // res.send(result, token);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to port=>", port);
});
app.get("/", (req, res) => {
  res.send("server");
});

/**
 * API Naming Convention
 * app.get('/products') get all products in this collection
 * app.get(/product/:id) specific product
 * app.get('/purchase') purchase one
 * app.patch('purchase/:id')
 * app.put('purchase/:id') upsert if have update or create
 * app.delete('/purchase/:id')
 */
