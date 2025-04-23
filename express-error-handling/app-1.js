const express = require('express');
const app = express();

app.get('/teste1', (req, res, next) => {
    res.send('teste1');
})

app.get('/teste2', (req, res, next) => {
    try {
        throw new Error('teste2 deu erro');
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/teste3', (req, res, next) => {
    throw new Error('teste3 deu erro');
})

app.listen(3000, () => {
    console.log('Server running at 3000');
})