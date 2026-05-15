export default {
    hello() {
        return { text: "Hello World!", views: 100 };
    },
    createUser({ userInput }, req) {
        const user = {
            id: Math.random().toString(),
            name: userInput.name,
            email: userInput.email,
            logs: []
        };
        return user;
    }
}