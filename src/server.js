const http = require('http');


const app = require('./app');

require('dotenv').config()


const server = http.createServer(app);

server.listen(8000, () => {
    console.log(`Listening on port ${8000}....`)

})
