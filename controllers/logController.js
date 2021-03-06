const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validatesession");

const{LogModel} = require("../models");

// POST CREATE A LOG WITH DESCRIPTION, DEFINITION, RESULT

router.post('/', validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const {id} = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

// GET ALL LOGS FOR A INDIVIDUAL USER

router.get('/', validateJWT, async (req, res) => {
    let id = req.user.id;
    console.log(req.user.id);
    console.log(req.user);
    try {
        const userLog = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLog);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

// GET LOG BY ID FOR A INDIVIDUAL USER

router.get('/:id', validateJWT, async (req, res) => {
    let logId = req.params.id;
    let userId = req.user.id;
    try {
        const userLog = await LogModel.findOne({
            where: {
                owner_id: userId,
                id: logId
            }
        });
        res.status(200).json(userLog);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

// UPDATE LOG

router.put('/:id', validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const logSearch = {
        where: {
            id: logId,
            owner_id: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    }

    try {
        const update = await LogModel.update(updatedLog, logSearch);
        res.status(200).json({message: "Log Entry Updated"});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

// DELETE LOG

router.delete("/:id", validateJWT, async (req, res) => {
    const logId = req.params.id;
    const userId = req.user.id;

    try {
        const deleteLog = {
            where: {
                id: logId,
                owner_id: userId
            }
        };

        await LogModel.destroy(deleteLog);
        res.status(200).json({message: "Log Entry Eradicated"})
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
});

module.exports = router;