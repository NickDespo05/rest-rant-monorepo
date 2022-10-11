const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const { User } = db;
const jwt = require("json-web-token");

router.post("/", async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email },
    });
    if (
        !user ||
        !(await bcrypt.compare(req.body.password, user.passwordDigest))
    ) {
        res.status(404).json({ message: "could not find user" });
    } else {
        const result = jwt.encode(process.env.JWT_SECRET, { id: userId });
        res.json({ user: user, token: result.value });
    }
});

router.get("/profile", async (req, res) => {
    try {
        const [authenticationMethod, token] =
            req.headers.authorization.split(" ");

        if (authenticationMethod === "bearer") {
            const result = await jwt.decode(process.env.JWT_SECRET, token);

            const { id } = result.value;

            let user = await User.findOne({
                where: {
                    userId: id,
                },
            });
            res.json(user);
        }
    } catch (error) {
        res.json(null);
    }
});

module.exports = router;
