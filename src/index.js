const Client = require('./Structures/Client');
const client = new Client();

client.init();

process.on("unhandledRejection", (err) => {
    console.log(err.stack || err);
});

process.on('uncaughtException', (err) => {
    console.log(err.stack || err);
})