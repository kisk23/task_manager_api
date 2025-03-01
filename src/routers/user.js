const express = require('express')
const User = require('../models/users')
const sharp = require('sharp');
const auth = require("../middleware/auth")
const multer = require("multer")
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
        // Ensure req.user is defined
        if (!req.user) { console.log("aloo") };


        // Delete the authenticated user
        await req.user.deleteOne();


        // Send the deleted user as the response
        res.send(req.user);
    } catch (e) {
        console.error("Delete user error:", e.message); // Log the error for debugging
        res.status(500).send({ error: "Internal server error" });
    }
});


const upload = multer({

    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("only accepts pictures"))
        }
        cb(undefined, true)
    }
})


router.post("/users/me/avatar", auth, upload.single("avatar"), async(req, res) => {

        const buffer = await sharp(req.file.buffer)
            .rotate()
            .resize(200)
            .png()
            .toBuffer()


        req.user.avatar = buffer
        await req.user.save()
        res.send(req.user)

    },
    (error, req, res, next) => {

        // A Multer error occurred (e.g., file size limit exceeded)
        return res.status(400).send({ message: error.message });



    }


)


router.delete("/users/me/avatar", auth, async(req, res) => {
    try {
        // Ensure req.user is defined
        if (!req.user) { console.log("aloo") };


        // Delete the authenticated user
        req.user.avatar = undefined
        await req.user.save()


        // Send the deleted user as the response
        res.send(req.user);
    } catch (e) {
        console.error("Delete user error avatar:", e.message); // Log the error for debugging
        res.status(500).send({ error: "Internal server error" });
    }
});
router.get("/users/:id/avatar", async(req, res) => {
    try {

        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error("can not find the user or pic")
        }
        res.set("content-Type", "image/png")
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send({ error: "Internal server error" });

    }


})

module.exports = router