const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const database = require('../db/database');

const saltRounds = 10;

const auth = {
    register: async function register(res, body) {
        
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "E-mail or password is missing",
                }
            })
        }

        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Not a correct e-mail format",
                }
            })
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not hash password",
                    }
                });
            }

            try {
                db = await database.getDb("users");

                const user = {
                    email: email,
                    password: hash
                }

                const resultset = await db.collection.insertOne(user);

                

                return res.status(201).json({
                    data: {
                        message: "User created",
                        _id: resultset.id,
                    }
                })
            } catch (error) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not create new user",
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },
}

module.exports = auth;