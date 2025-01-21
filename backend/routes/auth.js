const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

// Added missing login route implementation
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all required fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        user.password = undefined;
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // check for all the missing fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please enter all the required fields." });
    }

    // name validation
    if (name.length > 25) {
        return res.status(400).json({ error: "name can only be less than 25 characters" });
    }

    // email validation
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailReg.test(email)) {
        return res.status(400).json({ error: "please enter a valid email address." });
    }
    
    // validation of password
    if (password.length < 6) {
        return res.status(400).json({ error: "password must be at least 6 characters long" });
    }

    try {
        const doesUserAlreadyExist = await User.findOne({ email });
        // Fixed the logic for existing user check
        if (doesUserAlreadyExist) {
            return res.status(400).json({ error: `a user with the email [${email}] already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });

        // save the user
        const result = await newUser.save();
        
        // Remove password from response and then return
        result._doc.password = undefined;
        return res.status(201).json({ ...result._doc });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;