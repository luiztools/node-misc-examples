require('dotenv-safe').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/', async (req, res, next) => {
    console.log(req.body);

    // INÍCIO BLOCO DO TUTORIAL 2 - getIssue
    //const jiraClient = require('./jiraClient');
    //const issue = await jiraClient.getIssue('PT-1');
    //console.log(issue);
    //FIM BLOCO DO TUTORIAL 2 - getIssue

    // INÍCIO BLOCO DO TUTORIAL 2 - doneIssue
    //const jiraClient = require('./jiraClient');
    //const result = await jiraClient.doneIssue('PT-1');
    //console.log(result);
    //FIM BLOCO DO TUTORIAL 2 - doneIssue

    res.send('Hello World');
})

app.listen(process.env.PORT, () => {
    console.log(`Running at ${process.env.PORT}`)
})