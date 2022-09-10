const express = require('express');
const router = express.Router();

const docsModel = require('../models/docs');

router.get("/", (req, res) => docsModel.getAllDocs(res));

router.get("/:id", docsModel.getOneDocById(req, res));

router.post("/", docsModel.saveDoc(req, res));

router.put("/",  docsModel.updateDoc(req, res));

router.post("/update", docsModel.updateDoc(req, res));

module.exports = router;