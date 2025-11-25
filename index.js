const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("noteverse-db");
    const postsCollection = db.collection("posts");

    // -------------------------------------------
    // ✅ GET POSTS (filtered by authorId)
    // -------------------------------------------
    app.get("/posts", async (req, res) => {
      const { authorId } = req.query;

      let filter = {};
      if (authorId) {
        filter.authorId = authorId;
      }

      const posts = await postsCollection.find(filter).toArray();
      res.send(posts);
    });

    // -------------------------------------------
    // GET SINGLE POST
    // -------------------------------------------
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });

      if (!post) return res.status(404).send({ error: "Post not found" });

      res.send(post);
    });

    // -------------------------------------------
    // ✅ CREATE POST (must include authorId)
    // -------------------------------------------
    app.post("/posts", async (req, res) => {
      const newPost = req.body;

      if (!newPost.authorId) {
        return res.status(400).send({ error: "authorId is required" });
      }

      newPost.createdAt = new Date();

      const result = await postsCollection.insertOne(newPost);
      res.send(result);
    });

    // -------------------------------------------
    // UPDATE POST (only by owner)
    // -------------------------------------------

    app.put("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPost = req.body;

      try {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Only allow update if authorEmail matches
        if (
          updatedPost.authorEmail &&
          updatedPost.authorEmail !== post.authorEmail
        ) {
          return res.status(403).json({ error: "Not allowed" });
        }

        const result = await postsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              ...updatedPost,
              updatedAt: new Date(),
            },
          }
        );

        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // -------------------------------------------
    // DELETE POST (only by owner)
    // -------------------------------------------

    app.delete("/posts/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) });
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Only allow delete if email matches
        if (
          req.query.authorEmail &&
          req.query.authorEmail !== post.authorEmail
        ) {
          return res.status(403).json({ error: "Not allowed" });
        }

        const result = await postsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// Root
app.get("/", (req, res) => {
  res.send("NoteVerse Server is running...");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 NoteVerse Server running on port ${port}`);
});
