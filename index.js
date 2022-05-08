
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



function verifyJWToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next();
    })
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.wk5fz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itmeCollection = client.db('refreshResources').collection('item');

        // Auth 
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

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
        })

        // Get all Items With a Particular Email
        app.get('/allitem', verifyJWToken, async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            // console.log(decodedEmail)
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


        // Update Quantity
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantiy: updatedUser.quantiy
                }
            };
            const result = await itmeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
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