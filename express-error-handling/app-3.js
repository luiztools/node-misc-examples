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
        next(error);
    }
})

app.get('/teste3', async (req, res, next) => {
    throw new Error('teste3 deu erro');
})

app.use((error, req, res, next) => {
    console.log('error middleware');
    res.sendStatus(500);
})

app.listen(3000, () => {
    console.log('Server running at 3000');
})