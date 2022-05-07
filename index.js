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

        // Get one Item 
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itmeCollection.findOne(query);
            res.send(item);
        })

        // POST one Item
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await itmeCollection.insertOne(newItem);
            res.send(result);
        })

        // Delete one Item From Manage Item
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itmeCollection.deleteOne(query);
            res.send(result);

        }

         // Get all Items With a Particular Email
         app.get('/allitem', verifyJWToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            console.log(decodedEmail)
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = itmeCollection.find(query);
                const items = await cursor.toArray();
                res.send(items)
            }
            else {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
        })


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