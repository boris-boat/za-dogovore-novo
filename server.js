let express = require("express");
let mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

let app = express();
let db;
//da moze da koristi sajt iz foldera public
app.use(express.static("public"));
let connectionString =
  "mongodb+srv://vikendica:vikendica@cluster0.hayml.mongodb.net/zaDogovore?retryWrites=true&w=majority";
MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    db = client.db();
    app.listen(3000);
  }
);
app.use(express.json());
// da moze da izvlaci express podatke iz forme (req.body.item)
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname + "/index.html"));
  db.collection("slobodanDatum")
    .find()
    .toArray((err, items) => {
      res.send(`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Simple To-Do App</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
        crossorigin="anonymous"
      />
    </head>
    <body>
    <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</div>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
  
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input
                name="item"
                id="create-field"
                autofocus
                autocomplete="off"
                class="form-control mr-3"
                type="text"
                style="flex: 1"
              />
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
  
        <ul id="item-list" class="list-group pb-5">
        
        </ul>
      </div>
      <script>let items = ${JSON.stringify(items)}</script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
      </body>
  </html>
  `);
    });
});
app.post("/create-item", function (req, res) {
  console.log(req.body.text);
  db.collection("slobodanDatum").insertOne(
    { text: req.body.text }

    // function (err, info) {
    //   res.json(info.ops[0]);
    // }
  );
  res.redirect("/");
});
app.post("/update-item", function (req, res) {
  db.collection("slobodanDatum").findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.body.id) },
    { $set: { text: req.body.text } },
    function () {
      res.send("Success");
    }
  );
});

app.post("/delete-item", (req, res) => {
  db.collection("slobodanDatum").deleteOne(
    { _id: new mongodb.ObjectId(req.body.id) },
    () => {
      res.send("success");
    }
  );
});
