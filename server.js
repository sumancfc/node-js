const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const port = process.env.PORT || 8090;

const uri =
  "mongodb+srv://sumancfc:sumancfc@cluster0.3a8vlym.mongodb.net/animal?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });
//connect to mongodb 
async function run() {
  try {
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello IOT");
});

app.get("/pets", async (req, res) => {
  const collection = client.db("animal").collection("pets");
  const pets = await collection.find().toArray();
  res.send(pets);
}); //get all the pet

app.post("/pet/add", async (req, res) => {
  const pets = client.db("animal").collection("pets");
  const { name, species, age, owner } = req.body;

  const pet = await pets.insertOne({ name, species, age, owner });
  res.send(pet);
}); //add pet

app.get("/pet/:id", async (req, res) => {
  const pets = client.db("animal").collection("pets");
  const { id } = req.params;

  const pet = await pets.findOne({ _id: new ObjectId(id) });
  res.send(pet);
}); //get pet by id

app.put("/pet/:id", async (req, res) => {
  const pets = client.db("animal").collection("pets");
  const { id } = req.params;
  const updatePet = req.body;

  const pet = await pets.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatePet }
  );
  res.send(pet);
}); //edit pet

app.delete("/pet/:id", async (req, res) => {
  const pets = client.db("animal").collection("pets");
  const { id } = req.params;

  await pets.deleteOne({ _id: new ObjectId(id) });
  res.send("pet deleted");
}); //delete pet

run()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })
  .catch(console.dir);
