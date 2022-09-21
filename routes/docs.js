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

    

router.post(
    "/",
    async (req, res) => {
        docsModel.saveDoc(req, res)

        const newDoc = req.body;
        if (newDoc.name && newDoc.html) {
            const result = await docsModel.saveDoc(newDoc);
            return res.status(201).json({id: result.insertedId});
        } else {
            return res.status(400).json({errors: {
                message: "name and html needed to save document"
            }})
        }
    });

router.put("/", (req, res) => docsModel.updateDoc(req, res));

router.post("/update", (req, res) => docsModel.updateDoc(req, res));

module.exports = router;
