const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await useCollection.updateOne(filter, updateDoc, options);
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
