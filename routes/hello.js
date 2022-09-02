var express = require('express');
var router = express.Router();

/* router.get('/hello/:msg', function(req, res, next) {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
}); */


// This route does not work unsure why ...
router.get('/hello', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello world"
        }
    };

    res.json(data);
}); 

/* router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello world"
        } 
    };

    res.json(data);
}); */

/* app.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
}); 
 */

module.exports = router;