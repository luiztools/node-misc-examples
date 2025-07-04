const axios = require('axios');

const baseUrl = process.env.API_URL;

const auth = { 
    username: process.env.API_USER,
    password: process.env.API_KEY
}

async function addUser(user) {
    const response = await axios.post(`${baseUrl}/wp/v2/users`, user, { auth });
    return response.data;
}

async function addUserToCourse(userIds, courseId) {
    const data = { user_ids: userIds }
    const response = await axios.post(`${baseUrl}/ldlms/v1/sfwd-courses/${courseId}/users`, data, { auth });
    return response.data;
}

async function getTopics(courseId) {
    const topics = [];
    let response;
    let page = 1;

    do {
        response = await axios.get(`${baseUrl}/ldlms/v1/sfwd-topic?course=${courseId}&per_page=100&page=${page}`, { auth });
        topics.push(...response.data);
        page++;
    }
    while (response.data.length === 100);

    return topics;
}

async function updateTopic(topicId, payload){
    const response = await axios.post(`${baseUrl}/ldlms/v1/sfwd-topic/${topicId}`, payload, { auth });
    return response.data;
}

module.exports = {
   addUser,
   addUserToCourse,
   getTopics,
   updateTopic
}