const express = require('express');

const router = express.Router();

router.get('/:id', (req, res) => {
    res.render("videoChat", {id: "123"})
})

module.exports = router