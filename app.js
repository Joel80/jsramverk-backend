//const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const index = require('./routes/index');
const hello = require('./routes/hello');

const app = express();
const port = 1337;

//app.use(bodyParser.json()); //for parsing application/json
//app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.json());

app.use(cors());


// dont show logs when testing
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// "Imported routes"
app.use('/', index);

app.use('/hello', hello);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Should be last in code
app.use((req, res, next) => {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(res.headersSent) {
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

app.listen(port, ()=> console.log(`Example API listening on port ${port}`));

// Routes using app.

// A get route
/* app.get("/user", (req, res) => {
    const data = {
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    }
    res.json(data);
});

app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

app.put("/user", (req, res) => {

    // Returns 204 no content
    res.status(204).send();
});

app.delete("/user", (req, res) => {
    // Returns 204 no content
    res.status(204).send();
}); */

// Start the server



