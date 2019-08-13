var express = require('express');
var Parking = require('../models/parking')
var router = express.Router()

router.get('/', async (req, res) => {
    try {
        const parkings = await Parking.find();
        res.status(200).json(parkings)
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.post('/create',  async (req, res, next) => {
    console.log(req.body)
    const parking  = new Parking({
        code: req.body.code,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: req.body.image,
        icon: req.body.icon,
        capacity: req.body.capacity
    })

    try {
        const parkingsave = await parking.save()
        res.status(200).json(parkingsave);
    } catch (error) {
        res.status(500).json({ message: error})
    }
});

module.exports = router