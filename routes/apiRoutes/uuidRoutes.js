const {v4 : uuidv4} = require('uuid');
const router = require('express').Router();

router.get('/uuid/', (req, res) => {
  
  res.json(uuidv4());
});

module.exports  = router;