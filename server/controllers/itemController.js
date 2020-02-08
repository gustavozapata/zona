const fs = require("fs");

const items = JSON.parse(fs.readFileSync(`${__dirname}/../api/data.json`));

exports.getItems = (req, res) => {
  res.json({
    status: "success",
    results: items.length,
    data: { items }
  });
};
