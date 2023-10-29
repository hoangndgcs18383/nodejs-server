const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const connectDb = require('./api/db/connect')
require('dotenv').config()

const server = http.createServer(app);

const start = async () => {
    try {
        await connectDb(process.env.SERVER_URI);
        server.listen(port, console.log(`Server is connect ${port}...`));
    }
    catch (error) {
        console.log(error);
    }
}

start()