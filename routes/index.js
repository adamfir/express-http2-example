var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "Hello world"});
});

// router.get('/.well-known/pki-validation/pki-validation/98295294B91009B31241333A7DE29600.txt', function(req, res) {
//   res.sendFile(__dirname + '/98295294B91009B31241333A7DE29600.txt', (error) => {
//     console.log('error :>> ', error);
//   })
// })

module.exports = router;
