const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config();

const app=express();
const port=process.env.PORT||5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jcrs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('food_delivery');
        const servicesCollection=database.collection('services');
            // Get api
            app.get('/delivery',async(req,res)=>{
               const cursor=servicesCollection.find({});
               const services= await cursor.toArray();
               res.send(services)
            })
            // Get single services
            app.get('/delivery/:id',async(req,res)=>{
                const id=req.params.id;
                console.log('gatting id services',id)
                const query={_id:ObjectId(id)};
                const service=await servicesCollection.findOne(query);
                res.json(service)
            })
        // post api
        app.post('/delivery',async(req,res)=>{
            const service=req.body;
            console.log('post hit hit',service);
                const result=await servicesCollection.insertOne(service);
                console.log(result)
                res.json(result);

        })
        // Deliete option
        app.delete('/delivery/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('server connect')
})

app.listen(port,()=>{
console.log('best food server',port)
})