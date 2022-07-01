const http = require('http');

/*
const cors = require('cors');
const corsOptions = {
    origin: 'http://3.39.99.90:8080',
    credentials: true,
}
*/


const express = require('express');
const session = require('express-session');
const mysql_session = require('express-mysql-session');
const app = express();

const server = http.createServer(app);
const routes = require("./routes/");
require('dotenv').config();

const bodyParser = require('body-parser');

let options = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};
let session_store = new mysql_session(options);

// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(
    session({
        httpOnly: true,
        secret: "session_cookie_secret",
        store: session_store,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge : 600000 }, 
        rolling : true,
    })
);
app.use(routes);
app.use("/public",express.static(process.env.LOCAL_DIR+"/public"));
app.use("/img",express.static(process.env.LOCAL_DIR+"/img"));
app.use("/files",express.static(process.env.LOCAL_DIR+"/files"));
app.use("/excel",express.static(process.env.LOCAL_DIR+"/excel"));

console.log();

server.listen(8080,'0.0.0.0');