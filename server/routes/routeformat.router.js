var express = require('express');
var multer = require('multer')
var Routeformat = require('../models/routeformat')
var router = express.Router()
var upload = multer({ dest: 'tempuploads/' })

var fs = require('fs')


router.get('/', async (req, res) => {
    try {
        const routeformats = await Routeformat.find();
        res.status(200).json(routeformats)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        console.log('route------  id')
        console.log(id)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.post('/create', upload.any(), (req, res, next) => {

    let station_path = ""
    let train_path  = ""

    if (req.files) {
        req.files.forEach((file) => {
            console.log(file)
            var filename = (new Date).valueOf() + "-" + file.originalname
            fs.rename(file.path, 'upload/images/' + filename, (err) => {
                if (err) throw err;
                console.log(file.path)
            })
            
            if (file.fieldname == "station_icon") {
                station_path = '/assets/dist/public/images/' + filename
            }
            
            if (file.fieldname == "train_icon") {
                train_path = '/assets/dist/public/images/' + filename
            }
        })
    }

    const routeformat = new Routeformat({
        route: req.body.route,
        color: req.body.color,
        station_icon: station_path,
        train_icon: train_path,

    })

    console.log(req)
    const routeformatsave = routeformat.save()
        .then((obj) => {
            res.status(200).json(obj);
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })



}
);

module.exports = router