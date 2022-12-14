const validator = require('email-validator');
const bcrypt = require('bcryptjs');
const database = require('../db/database');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const auth = {
    register: async function register(res, body) {
        let db;

        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                data: {
                    errors: {
                        status: 400,
                        message: "E-mail or password is missing",
                    }
                }

            });
        }

        if (!validator.validate(email)) {
            return res.status(400).json({
                data: {
                    errors: {
                        status: 400,
                        message: "Not a correct e-mail format",
                    }
                }

            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    data: {
                        errors: {
                            status: 500,
                            message: "Could not hash password",
                        }
                    }

                });
            }

            try {
                db = await database.getDb("users");

                const user = {
                    email: email,
                    password: hash
                };

                const resultset = await db.collection.insertOne(user);



                return res.status(201).json({
                    data: {
                        message: "User created",
                        _id: resultset.id,
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    data: {
                        errors: {
                            status: 500,
                            message: "Could not create new user",
                        }
                    }

                });
            } finally {
                await db.client.close();
            }
        });
    },

    login: async function login(res, body) {
        let db;

        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                data: {
                    errors: {
                        status: 400,
                        message: "E-mail or password is missing",
                    }
                }

            });
        }

        try {
            db = await database.getDb("users");

            const query = {
                email: email,
            };

            const user = await db.collection.findOne(query);

            if (user) {
                return auth.comparePasswords(res, user, password);
            }
            return res.status(401).json({
                data: {
                    errors: {
                        message: "Could not find user",
                    }
                }

            });
        } catch (error) {
            return res.status(500).json({
                data: {
                    errors: {
                        status: 500,
                        message: "Could not find user",
                    }
                }

            });
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: async function comparePasswords(res, user, password) {
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                return res.status(500).json({
                    data: {
                        errors: {
                            status: 500,
                            message: "Could not decrypt password",
                        }
                    }

                });
            }

            if (result) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;

                const token = jwt.sign(payload, secret, {expiresIn: "1h"});

                return res.status(201).json({
                    data: {
                        _id: user._id,
                        email: user.email,
                        token: token,
                    }
                });
            }

            return res.status(401).json({
                data: {
                    errors: {
                        status: 401,
                        message: "Password not correct",
                    }
                }
            });
        });
    },

    checkToken: function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    data: {
                        errors: {
                            status: 401,
                            message: "Token not valid",
                        }
                    }

                });
            }

            // Token is valid continue
            //console.log(decoded);
            req.email = decoded.email;
            next();
        });
    }
};

module.exports = auth;
