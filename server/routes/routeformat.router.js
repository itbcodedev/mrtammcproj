var express = require('express');
var multer = require('multer')
var Routeformat = require('../models/routeformat')
var router = express.Router()
var upload = multer({ dest: 'uploads/' })

var fs = require('fs')


router.get('/', async (req, res) => {
    try {
        const routeformats = await Routeformat.find();
        res.status(200).json(routeformats)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.post('/create', upload.any(), (req, res, next) => {

    if (req.files) {
        req.files.forEach((file) => {
            console.log(file)
            var filename = (new Date).valueOf() + "-" + file.originalname
            fs.rename(file.path, 'public/images/' + filename, (err) => {
                if (err) throw err;
                console.log(file.path)
            })
            
        })
    }

    const routeformat = new Routeformat({
        route: req.body.route,
        color: req.body.color,
        station_icon: req.body.station_icon,
        train_icon: req.body.train_icon,

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