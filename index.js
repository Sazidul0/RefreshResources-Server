const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// Middle ware 
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.wk5fz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itmeCollection = client.db('refreshResources').collection('item');



        // Get all Items
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itmeCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })




    }
    finally {

    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Refresh Resourses');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});