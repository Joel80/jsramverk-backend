const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const docs = require('./routes/docs');

const app = express();
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

// Start the server
app.listen(port, ()=> console.log(`Example API listening on port ${port}`));
