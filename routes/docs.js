const express = require('express');
const router = express.Router();

const docsModel = require('../models/docs');
const authModel = require('../models/auth');


router.get(
    "/",
    (req, res, next) => authModel.checkToken(req, res, next),
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

router.put(
    "/", 
    async (req, res) => {

        let doc = {
            _id: req.body._id,
            name: req.body.name,
            html: req.body.html
        }

        if (doc._id) {
            const result = await docsModel.updateDoc(doc);
            return res.status(200).json({result});
        } else {
            return res.status(400).json({errors: {
                message: "_id needed to update document"
            }});
        }

       


    });

module.exports = router;
