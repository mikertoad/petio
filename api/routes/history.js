const express = require("express");
const router = express.Router();
const getHistory = require("../plex/history");
const getBandwidth = require("../plex/bandwidth");
const getServerInfo = require("../plex/serverInfo");

router.post("/", async (req, res) => {
  let id = req.body.id;
  if (id === "admin") id = 1;
  let data = await getHistory(id, req.body.type);
  res.json(data);
});

router.get("/bandwidth", async (req, res) => {
  try {
    let data = await getBandwidth();
    res.json(data.MediaContainer.StatisticsBandwidth);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/server", async (req, res) => {
  try {
    let data = await getServerInfo();
    res.json(data.MediaContainer);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
