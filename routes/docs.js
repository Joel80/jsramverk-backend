const express = require('express');
const router = express.Router();

const docsModel = require('../models/docs');

router.get(
    "/", 
    async (req, res) => {
       const docs = await docsModel.getAllDocs()

       return res.json({
        data: docs
       });
    });

router.get(
    "/:_id", 
    async (req, res) => {
       const doc = await docsModel.getOneDocById(req.params._id)
       return res.json({
        data: doc
        });
    });

    

router.post("/", (req, res) => docsModel.saveDoc(req, res));

router.put("/", (req, res) => docsModel.updateDoc(req, res));

router.post("/update", (req, res) => docsModel.updateDoc(req, res));

module.exports = router;
