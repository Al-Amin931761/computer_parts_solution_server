const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0oqfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('computer_parts').collection('parts');
        const bookingCollection = client.db('computer_parts').collection('booking');

        // all parts data load
        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        // single part data load 
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const part = await partsCollection.findOne(query);
            res.send(part);
        })

        app.post("/booking", async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/booking', async (req, res) => {
            const buyerEmail = req.query.buyerEmail;
            const query = { buyerEmail: buyerEmail }
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello form Computer Parts Solution!')
})

app.listen(port, () => {
    console.log(`Computer Parts Solution listening on port ${port}`)
})