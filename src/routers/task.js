const express = require('express')
const Task = require('../models/tasks')
const auth = require("../middleware/auth")
const router = new express.Router()




router.get("/tasks", auth, async(req, res) => {
    try {
        //  const tasks = await Task.find({ owner: req.user._id });
        // res.send(tasks);
        await req.user.populate('tasks')
        res.send(req.user.tasks)

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


router.patch("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUdates = ["describtion", "complete"]
    const isValid = updates.every((update) => allowedUdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "invalid updates" })

    }


    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;

    try {
        // Find and delete the task by ID and ensure it belongs to the authenticated user
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        // Send the deleted task as the response
        res.send(task);
    } catch (e) {
        console.error("Error deleting task:", e.message); // Log the error for debugging
        res.status(500).send({ error: "An error occurred while deleting the task" });
    }
});




module.exports = router