const axios = require('axios');

const options = {
    headers: {
        "Content-Type": "application/json"
    },
    auth: {
        username: process.env.USER,
        password: process.env.PASSWORD
    }
};

async function getIssue(id) {
    try {
        const result = await axios.get(
            `${process.env.BASE_URL}rest/api/2/issue/${id}`,
            options
        )
        return result.data;
    } catch (error) {
        console.error(error);
    }
}

async function doneIssue(id) {
    try {
        const result = await axios.post(
            `${process.env.BASE_URL}rest/api/2/issue/${id}/transitions?expand=transitions.fields`,
            {
                "transition": {
                    "id": "41"
                }
            },
            options
        )
        return result.data;
    } catch (error) {
        console.error(error.response);
    }
}

module.exports = { getIssue, doneIssue }