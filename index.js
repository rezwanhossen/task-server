const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5001;

const app = express();
//meddil wair =======
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5001"],
  })
);
app.use(express.json());

//=================================================

// const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.User}:${process.env.U_pass}@cluster0.p5jkrsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCol = client.db("job-task").collection("product");

    // await client.connect();
    app.get("/product", async (req, res) => {
      const result = await productCol.find().toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//===================================================
app.get("/", (req, res) => {
  res.send("was running");
});
app.listen(port, () => {
  console.log(`running on port : ${port}`);
});
