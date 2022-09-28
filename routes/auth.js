const express = require('express');
const router = express.Router();

const authModel = require('../models/auth');

router.post(
    "/register",
    async (req, res) => {
        const body = req.body;

        authModel.register(res, body);
    }
);

router.post(
    "/login",
    async (req, res) => {
        const body = req.body;

        authModel.login(res, body);
    }
);

module.exports = router;
