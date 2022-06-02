const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const corsOption = () => {
  origin: 'https://react-exp-cycle-eqp-manufactur.web.app/';
  // origin: 'http://localhost:3000/';
}
// app.use(cors(corsOption));
app.use(cors({origin: 'https://react-exp-cycle-eqp-manufactur.web.app/'}));
// app.use(cors({origin: 'http://localhost:3000/'}));
app.use(express.json());

const { options } = require("nodemon/lib/config");
const uri = `mongodb+srv://equip_manufacturer:Jq0ppy2tBe16fi61@cluster0.a3zpv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();

    const userCollection = client
      .db("equipment_manufacturer")
      .collection("users");
    const productCollection = client
      .db("equipment_manufacturer")
      .collection("products");
    const categoryCollection = client
      .db("equipment_manufacturer")
      .collection("Categories");
    const reviewCollection = client
      .db("equipment_manufacturer")
      .collection("reviews");
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    app.get('/cors', (req, res) => {
      res.set('Access-Control-Allow-Origin', 'https://react-exp-cycle-eqp-manufactur.web.app/');
      res.send({ "msg": "This has CORS enabled 🎈" })
      })
    //get products
    app.get("/products", async (req, res) => {
      const products = await productCollection.find().toArray();
      res.send(products);
    });
    //get product by id
    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    //get category
    app.get("/categories", async (req, res) => {
      const categories = await categoryCollection.find().toArray();
      res.send(categories);
    });
    //get reviews
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    });
    //make admin
    app.put("/user/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      // const requestAccount = req;
      console.log(requestAccount, "req");
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    //make normal user
    app.put("/user/nUser/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: "user" },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    //store users
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.headers.authorization;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "190s" }
      );
      console.log(token);
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
