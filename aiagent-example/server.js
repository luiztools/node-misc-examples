//server.js
import "dotenv/config";
import express from "express";
import morgan from "morgan";

const app = express();

let nextId = 1;
const customers = [];

app.use(express.json());
app.use(morgan("tiny"));

app.post("/customers", (req, res, next) => {
    const newCustomer = {
        id: nextId++,
        name: req.body.name,
        age: parseInt(req.body.age),
        uf: req.body.uf
    };

    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});

app.get("/customers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const customer = customers.find(c => c.id === id);
    res.json(customer);
})

app.get("/customers/", (req, res) => {
    res.json(customers);
})

app.get("/", (req, res, next) => {
    res.json(customers);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server listening at ${PORT}`));
