const express = require('express');
const { AsyncHandler } = require('../utils/async_handler');
const router = express.Router();
const { fetch } = require("fetch-h2");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{
    id: 1,
    name: "Adam",
  }, {
    id: 2,
    name: "Firdaus",
  }]);
});

/* GET user by id. */
router.get('/id/:id', async function(req, res, next) {
  const id = req.params.id;

  // known issue with axios adapter: currently not yet support HTTP2
  // https://stackoverflow.com/a/62635506
  // https://github.com/axios/axios/issues/1175
  // const promise = axios({
  //   url: (process.env.BASE_URL || "https://localhost") + "/users",
  //   method: 'GET',
  // });

  // use fetch-h2 instead
  const promise = fetch({
    url: (process.env.BASE_URL || "https://localhost") + "/users",
    method: "GET",
  });

  let [response, error] = await AsyncHandler(promise);
  if (error !== null) {
    return res.status(400).json({
      error: error.message
    });
  }

  console.log('response.httpVersion :>> ', response.httpVersion);
  let [data, error2] = await AsyncHandler(response.json());
  if (error2 !== null) {
    return res.status(400).json({
      error: error2.message
    });
  }

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      message: "cannot fetch users"
    });
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      return res.status(200).json(data[i]);
    }
  }
  return res.status(404).json({
    message: "user not found",
  });
});

module.exports = router;
