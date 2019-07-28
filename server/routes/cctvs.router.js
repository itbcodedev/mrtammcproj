var express = require('express');
var router = express.Router();
var Cctv = require('../models/cctv')

router.get('/', async (req, res) => {
    try {
        const cctvs = await Cctv.find();
        res.status(200).json(cctvs)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/delete/:cctv_id', async (req, res) => {
    try 
    {
        const removecctv = await Cctv.remove({ _id: req.params.cctv_id});
        res.status(200).json(removecctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/:cctv_id', async (req, res) => {
    try 
    {
        const cctv = await Cctv.findById(req.params.cctv_id)
        res.status(200).json(cctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.patch('/update/:cctv_id', async (req, res) => {
    try 
    {
        const updateObject = req.body;
        const updatecctv = await Cctv.updateOne(
            { _id: req.params.cctv_id},
            { $set: updateObject});
        res.status(200).json(updatecctv)
    } catch (error) {
        res.status(500).json({message: error})
    }
})
router.post('/create', async (req, res, next) => {
    const cctv = new Cctv({
        code: req.body.code,
        name: req.body.name,
        protocol: req.body.protocol,
        host: req.body.host,
        port: req.body.port,
        username: req.body.username,
        password: req.body.password,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        description: req.body.description
    })

    try {
        const cctvsave = await cctv.save();
        res.status(200).json(cctvsave);
    } catch (error) {
        res.status(500).json({ message: error})
    }
    
})


module.exports = router




    