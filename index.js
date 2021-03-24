const express = require('express')
const ObjectId = require("mongodb").ObjectID;

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://emdadul:emdadul446@cluster0.na8bp.mongodb.net/sampleDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded());


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})



client.connect(err => {
    const productCollection = client.db("sampleDB").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
            .then(result => {
                console.log('one product added')
                res.redirect('/')
            })

    })

    app.delete("/delete/:id", (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);

                res.send(result.deletedCount > 0);


            })
    })

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price)
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })


    console.log("database connected")

});



app.listen(3000);