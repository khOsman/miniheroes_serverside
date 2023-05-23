const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvaeumc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        const heroesCollection = client.db('MiniHeroes').collection('Heroes');

        app.get('/alltoys', async (req, res) => {
            const cursor = heroesCollection.find();
            const limit = 20;
            const result = await cursor.limit(limit).toArray();
            res.send(result);
        });

        app.get('/gallery', async (req, res) => {
            const cursor = heroesCollection.aggregate(
                [{ $sample: { size: 6 } }]
            )
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await heroesCollection.findOne(query);

            res.send(result);
        });

        app.get('/mytoys/:id', async (req, res) => {
            const uid = req.params.id;
            const query = { uid: uid }
            const result = await heroesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/toprated', async (req, res) => {
            const query = {};
            const sort = { rating: -1 };
            const limit = 6;
            const cursor = heroesCollection.find(query);
            const result = await cursor.sort(sort).limit(limit).toArray();
            res.send(result);
        });

        app.get('/avengers', async (req, res) => {
            const sub = 'Avengers';
            const query = { sub_category: sub }
            const result = await heroesCollection.find(query).toArray();
            res.send(result);
        });


        app.get('/guardians', async (req, res) => {
            const sub = 'Guardian Of The Galaxy';
            const query = { sub_category: sub }
            const result = await heroesCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/xmens', async (req, res) => {
            const sub = 'X-men';
            const query = { sub_category: sub }
            const result = await heroesCollection.find(query).toArray();
            res.send(result);
        });

        app.put('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedHero = req.body;
            const hero = {
                $set: {
                    "sub_category": updatedHero.sub_category,
                    "picture": updatedHero.picture,
                    "toy_name": updatedHero.toy_name,
                    "seller_name": updatedHero.seller_name,
                    "seller_email": updatedHero.seller_email,
                    "price": updatedHero.price,
                    "rating": updatedHero.rating,
                    "available_quantity": updatedHero.available_quantity,
                    "detail_description": updatedHero.detail_description
                }
            }
            const result = await heroesCollection.updateOne(query, hero, options);

            res.send(result);
        });

        app.post('/alltoys', async (req, res) => {
            const newHero = req.body;
            const result = await heroesCollection.insertOne(newHero);
            res.send(result);
        });


        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await heroesCollection.deleteOne(query);
            res.send(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


//console.log('uri', uri);

app.get('/', (req, res) => {
    res.send("Mervel Toys server is smashing");
});


app.listen(port, () => {
    console.log(`Marvel toys is smashing on port ${port}`);
});