const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require("cors")
const app =express();
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

// port 
const port = process.env.PORT || 5000;

// middlewase 
app.use(cors());
app.use(express.json());


// Connect to db 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujchq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('db connected successfully');
        const database = client.db('services_db')
        const serviceCollection = database.collection('service')
        const CartCollection = database.collection('cart')


        // post service api 
        app.post('/services', async(req,res)=>{
            const service = req.body
            // console.log('post hited',service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        // post cart api 
        app.post('/cart', async(req,res)=>{
            const cart = req.body
            console.log('post hited',cart);
            const result = await CartCollection.insertOne(cart);
            console.log(result);
            res.json(result);
        });


    // get service api
        app.get('/services', async(req, res) =>{
           const cursor = serviceCollection.find({});
           const services = await cursor.toArray();
           res.send(services);
           
        });
    // get cart api
        app.get('/cart', async(req, res) =>{
           const cursor = CartCollection.find({});
           const cart = await cursor.toArray();
           res.send(cart);
           
        });
   
    // get my orders api
        app.get("/myorders/:email", async(req, res) =>{
            console.log(req.params.email);
            const cursor= await CartCollection.find({email: req.params.email });
            const cart = await cursor.toArray();
            res.send(cart);
             
        });



    // delete service
        app.delete('/cart/:id' , async(req, res) =>{
            const id = req.params.id;
            const query = {_id:id}; 
            const result = await CartCollection.deleteOne(query);
            res.json(result);
            console.log("delete id",result);

        });
    // delete service
        app.delete('/services/:id' , async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}; 
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
            console.log("delete id",result);

        });
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/',(req, res)=>{
    res.send("Assignment server is running!!!")
});


app.listen(process.env.PORT || port, (req, res) => {
    console.log("listen to port",port);
});












