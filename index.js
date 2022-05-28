const express = require('express');
const fs = require("fs");

const app = express();
app.use(express.static(__dirname));

function FUSE_FN(fn){
	var fne;
	app.get("/fuse/run/" + fn.name, async (req, res) => {
		if (req.query.args) {
			var args = atob(req.query.args).split(",");
      if (fn.constructor.name == "AsyncFunction") {
			  res.send(await fn(...args))
      } else {
        res.send(fn(...args))
      }
		} else {
			if (fn.constructor.name == "AsyncFunction") {
			  res.send(await fn(...args))
      } else {
        res.send(fn(...args))
      }
		}
	})
  }

if (fs.existsSync("preload.json")) {
  var preload = JSON.parse(fs.readFileSync("preload.json").toString());
  preload.files.forEach(function(file){
    eval(fs.readFileSync(file).toString())
  })
}
app.get('/fuse/attach/:code', (req, res) => {
  eval(atob(req.params.code))
  res.send("attached")
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server started');
});
