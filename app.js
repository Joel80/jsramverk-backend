require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const docs = require('./routes/docs');
//const docsModel = require('./models/docs');

const app = express();
const httpServer = require('http').createServer(app);

const port = process.env.PORT || 1337;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// dont show logs when testing
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// A route
app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

// "Imported routes"
app.use('/docs', docs);


// Routes for 404 and error handling
// Catch 404 and forward to error handler
// Should be last in code
app.use((req, res, next) => {
    var err = new Error("Not found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', function(socket) {
    console.log(socket.id);

    socket.on('create', function(room) {
        socket.join(room);
        console.log("Room created");
    });

    socket.on("doc", function (data) {
        socket.to(data["_id"]).emit("doc", data); //kanske broadcast istället för to?
        //socket.broadcast.emit("doc", data);
        console.log("Receiving data");
        console.log(`Data: ${data._id} - ${data.name} - ${data.html}`);

        /* if (data._id) {
            docsModel.update(data);
        }
         */
        // Do something with data (save to db)
        //console.log(data);
    });
});


// Start the server
const server = httpServer.listen(port, ()=> console.log(`API listening on port: ${port}`));

module.exports = server;
