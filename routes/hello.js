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


// Hello route 
router.get("/:msg", function(req, res, next) {
    const data = {
        data: {
            msg: req.params.msg
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