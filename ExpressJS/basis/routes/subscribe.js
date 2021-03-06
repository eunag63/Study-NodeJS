const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");
const Subscriber = require("../models/Subscriber");

router.post('/subscribeNumber', async(req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo })
        .exec((err, subscribe) =>{
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })
})

router.post('/subscribed', async(req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
        .exec((err, subscribe) => {
            if(err) return res.status(400).send(err);
            let result = false
            if(subscribe.length !== 0 ){
                result = true
            }
            return res.status(200).json({ success: true, subscribed: result })
        })
})


module.exports = router;