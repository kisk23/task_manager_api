const express = require('express')
const User = require('../models/users')
const auth = require("../middleware/auth")
const router = new express.Router()




router.post("/users", async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateWebToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)

    }
})

router.post("/users/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateWebToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }


})


router.post('/users/logout', auth, async(req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("logged out")
    } catch (error) {
        res.status(500).send()
    }

})
router.post('/users/logoutAll', auth, async(req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send("logged out from all")
    } catch (error) {
        res.status(500).send()
    }

})
router.get("/users/me", auth, async(req, res) => {

    res.send(req.user)

})

router.patch("/users/me", auth, async(req, res) => {
    const _id = req.user._id;
    const updates = Object.keys(req.body)
    const allowedUdates = ["name", "age", "email", "password"]
    const isValid = updates.every((update) => allowedUdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "invalid updates" })

    }


    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
            // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/users/me", auth, async(req, res) => {
    try {
        // Delete the authenticated user
        const user = await User.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Alternatively, you can use req.user.remove()
        // await req.user.remove();

        res.send(user); // Send the deleted user as the response
    } catch (e) {
        console.error("Delete user error:", e.message); // Log the error for debugging
        res.status(500).send({ error: "Internal server error" });
    }
});

module.exports = router