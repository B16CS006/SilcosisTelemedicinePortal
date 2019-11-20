const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("videoChat", {id: "123"})
})

module.exports = router