const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());
//database related functionality
//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mqcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("volunteer-services");
    const servicesCollections = database.collection("services");
    const registerServicesCollections = database.collection("register-service");
    //get api to get all the data
    app.get("/services", async (req, res) => {
      const result = await servicesCollections.find({}).toArray();
      res.send(result);
    });
    //get api to get one data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollections.findOne(query);
      res.send(result);
    });
    //get all data from  register user
    app.get("/user/register", async (req, res) => {
      const result = await registerServicesCollections.find({}).toArray();
      res.json(result);
    });
    //POst api for one data
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollections.insertOne(service);
      res.json(result);
    });
    //api to post registration of user
    app.post("/register/service", async (req, res) => {
      const userEvent = req.body;
      const result = await registerServicesCollections.insertOne(userEvent);
      res.json(result);
    });
    //post api to get user email based data
    app.post("/services/user", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: { $in: [userEmail] } };
      const result = await registerServicesCollections.find(query).toArray();
      res.send(result);
    });

    //delete api to delete one from main database
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollections.deleteOne(query);
      res.json(result);
    });
    //delete register user work api
    app.delete("/services/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await registerServicesCollections.deleteOne(query);
      res.json(result);
    });
    //delete one data from register user
    app.delete("/user/register/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await registerServicesCollections.deleteOne(query);
      res.json(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("BACKEND OK ");
});

app.listen(port, () => {
  console.log("Server running at port", port);
});
