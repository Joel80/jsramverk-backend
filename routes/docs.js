const express = require('express');
const router = express.Router();

const docsModel = require('../models/docs');

router.get("/", (req, res) => docsModel.getAllDocs(req, res));

router.post("/", (req, res) => docsModel.saveDoc(req, res));

router.post("/update", (req, res) => docsModel.updateDoc(req, res));

module.exports = router;