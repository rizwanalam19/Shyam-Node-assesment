require("dotenv").config();
const express = require('express');
const ejs = require("ejs");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "uploads");
    },
    filename: function(req, file, cb) {
      console.log(file);
  
      cb(null, file.originalname);
    },
  });
  var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "pdf" ||
        file.mimetype == "txt"
      ) {
        cb(null, true);
      } else {
        console.log(file);
        cb(null, false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
  })
app.use(express.json());

const static_path = path.join(__dirname, "../public");
app.set("view engine", "ejs");

app.set('views', 'views');

var bodyParser = require("body-parser");
const partial_path = path.join(__dirname, "../templates/components");
app.use(express.urlencoded({
  extended: false
}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(static_path));


app.get('/', (req, res) => {
    res.render('../view/form.ejs');
  });
  app.post("/", upload.single('file'),async(req, res, next)=>{
    try {
        const service = new service({
          ServiceNumber: req.body.servicenumber,
          ServiceName: req.body.servicename,
          Price: req.body.price,
          Description: req.body.description,    
          Photo: {
            data: req.file.filename,
            contentType: "image/png",
          },
      });
      const Form_data = await service.save();
  console.log(Form_data);
  res.status(201).render("success");

} catch (error) {
  console.log(error);
}
  });
  app.get('/table', (req, res) => {
    res.render('../view/table.ejs');
  });
    app.listen(process.env.PORT || 8000, ()=>{
    console.log(`server is running at port ${process.env.PORT}`)
});