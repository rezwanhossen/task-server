const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
//meddil wair =======
app.use(
  cors({
    origin: ["https://task-sol-clint.web.app", "http://localhost:5000"],
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
    // app.get("/product", async (req, res) => {
    //   const size = parseInt(req.query.size);
    //   const page = parseInt(req.query.page) - 1;
    //   const filterone = req.query.filterone;
    //   const filtertwo = req.query.filtertwo;
    //   const sort = req.query.sort;
    //   const search = req.query.search;
    //   let query = {
    //     product_name: { $regex: search, $options: "i" },
    //   };
    //   if (filterone) query.category_name = filterone; //= { category_name: filterone };
    //   if (filtertwo) query.brand = filtertwo;
    //   let option = {};
    //   if (sort) option = { sort: { price: sort === "Low to High" ? 1 : -1 } };
    //   const result = await productCol
    //     .find(query, option)
    //     .skip(page * size)
    //     .limit(size)
    //     .toArray();
    //   res.send(result);
    // });
    app.get("/product", async (req, res) => {
      try {
        const size = parseInt(req.query.size) || 10; // Default size if not provided
        const page = parseInt(req.query.page) - 1 || 0; // Default to 0 if page is not provided
        const filterone = req.query.filterone; // Category filter
        const filtertwo = req.query.filtertwo; // Brand filter
        const sort = req.query.sort; // Sort option
        const search = req.query.search || ""; // Default to empty string if not provided

        // Building the query object
        let query = {
          product_name: { $regex: search, $options: "i" }, // Search by product name
        };

        // Adding filters if provided
        if (filterone) query.category_name = filterone;
        if (filtertwo) query.brand = filtertwo;

        // Building the sorting option
        let options = {};
        if (sort) {
          options.sort = { price: sort === "Low to High" ? 1 : -1 };
        }

        // Fetching data from the database with pagination
        const result = await productCol
          .find(query, options)
          .skip(page * size)
          .limit(size)
          .toArray();

        // Sending the result back to the client
        res.send(result);
      } catch (error) {
        // Catching any errors that might occur
        res.status(500).json({ message: "Internal Server Error", error });
      }
    });

    // await client.connect();
    // app.get("/product-count", async (req, res) => {
    //   const filterone = req.query.filterone;
    //   const filtertwo = req.query.filtertwo;
    //   const search = req.query.search;
    //   //   let query = {};
    //   //   if (filterone) query = { category_name: filterone };
    //   let query = {
    //     product_name: { $regex: search, $options: "i" },
    //   };
    //   if (filterone) query.category_name = filterone;
    //   if (filtertwo) query.brand = filtertwo;
    //   const count = await productCol.countDocuments(query);
    //   res.send({ count });
    // });
    app.get("/product-count", async (req, res) => {
      try {
        const filterone = req.query.filterone; // Category filter
        const filtertwo = req.query.filtertwo; // Brand filter
        const search = req.query.search || ""; // Search query, defaults to an empty string

        // Building the query object
        let query = {
          product_name: { $regex: search, $options: "i" }, // Case-insensitive search
        };

        // Adding filters if provided
        if (filterone) query.category_name = filterone;
        if (filtertwo) query.brand = filtertwo;

        // Counting the documents based on the query
        const count = await productCol.countDocuments(query);

        // Sending the count result back to the client
        res.send({ count });
      } catch (error) {
        // Error handling
        res.status(500).json({ message: "Internal Server Error", error });
      }
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
