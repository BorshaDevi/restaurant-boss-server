const express =require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')
const port=process.env.PORT || 5000

//middle
app.use(cors())
app.use(express.json())







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_name}:${process.env.DB_pass}@cluster0.uqcmivv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    
    const userCollection = client.db("MenuDB").collection("user");
    const menuCollection = client.db("MenuDB").collection("menu");
    const reviewCollection=client.db("MenuDB").collection("reviews");
    const cartCollection=client.db("MenuDB").collection("carts");
    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })

  app.get('/carts',async(req,res)=>{
    const email=req.query.email
    const query={userEmail : email}
    const cursor = await cartCollection.find(query).toArray();
    
    res.send(cursor)
  })

    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray()
        
        res.send(result)
    })
    app.get('/reviews',async(req,res)=>{
      const result=await reviewCollection.find().toArray()
      res.send(result)
    })
    app.post('/carts',async(req,res)=>{
      const cart=req.body
      const result=await cartCollection.insertOne(cart)
     
      res.send(result)
    })
    app.post('/user',async(req,res)=>{
      const user=req.body
      
      const query={email : user.email}
      const isExied=await userCollection.findOne(query)
      if(isExied){
        return res.send('This email is exised')
      }
      const result=await userCollection.insertOne(user)
      res.send(result)
    })
    app.patch('/userAdmin/:Id',async(req,res)=>{
       const id=req.params.Id
       const filter = { _id: new ObjectId(id) };
       const updateDoc = {
        $set: {
          role:'admin'
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    app.delete('/delete/:id',async(req,res)=>{
      const Id=req.params.id
      const query={_id : new ObjectId(Id)}
      const result=await cartCollection.deleteOne(query)
      res.send(result)
    })
    app.delete('/deleteUser/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
     res.send('This is restaurant')
})
app.listen(port,()=>{
    console.log(`This is from ${port}`)
})
