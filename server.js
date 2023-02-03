const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();





app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//page navigation
app.use(express.static("public"));
app.get("/", (req, res) => res.send("Navigate to /index or /notes"));

//Get route for home page
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
  console.info(`${req.method} request received for \n/Index`);
});

//Get route for notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
  console.info(`${req.method} request received for\n/Notes`);
});

//API GET REQUEST
app.get("/api/notes", (req, res) => {
  console.log("GET notes request");
  //read the db.json file using readFileSync
  let data = fs.readFileSync("./db/db.json", "utf-8");
  //send response of json data of GET request
  //must be parsed and stringified later
  res.json(JSON.parse(data));
});
// API POST REQUEST
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to save a note`);
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    //read data from json file
    let data = fs.readFileSync("./db/db.json", "utf-8");

    const dataJSON = JSON.parse(data);
    dataJSON.push(newNote);

    //write notes to db.json file
    fs.writeFile("./db/db.json", JSON.stringify(dataJSON), (err, text) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(text);
    });
    console.log("added a new note");
    //send json data response
      const response = {
        status: "success",
        body: newNote
      }
    // TODO: Add a comment explaining the functionality of res.json()
    res.status(201).json(response);
  } else {
    // TODO: Add a comment describing the purpose of the else statement in this POST request.
    res.status(500).json('Error in posting note');
  }
});





//API DELETE
app.delete("/api/notes/:id", (req, res) =>{
  //READ FILE
  let data = fs.readFileSync("./db/db.json", "utf-8")

  // variable for setting up filter method
  const dataJSON = JSON.parse(data)

  //if newNote has a false value, use filter method and req.params
  const newNote = dataJSON.filter((note)=>{
    return note.id !== req.params.id;
  })
  console.log("🚀 ~ file: server.js:83 ~ newNote ~ req.params", req.params)
  
  fs.writeFile("./db/db.json", JSON.stringify(newNote), (err, text) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  res.json(newNote)
})










app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)

);