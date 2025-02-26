const express = require('express')
const Task = require('../models/tasks')
const auth = require("../middleware/auth")
const router = new express.Router()




router.get("/tasks", async(req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
            // const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.send(task);
    } catch (e) {
        res.status(500).send({ error: `An error occurred while fetching the task: ${e.message}` });
    }
});

router.post("/tasks", auth, async(req, res) => {
    const task = new Task({
        ...req.body,

        "owner": req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.patch("/tasks/:id", async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUdates = ["describtion", "complete"]
    const isValid = updates.every((update) => allowedUdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "invalid updates" })

    }


    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
            //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/tasks/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }


})




module.exports = router