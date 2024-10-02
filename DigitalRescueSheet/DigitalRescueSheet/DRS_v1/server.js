const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const multer = require('multer');
const fs = require('fs');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'SEP123testing',
        database: 'loginsignupdata'
    }
});

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/hilmi/Desktop/SEP rubbish/DRS-01/Digital Rescue Sheet/upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['model/gltf+json', 'model/gltf-binary'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
    if (allowedTypes.includes(file.mimetype) && (fileExtension === 'glb' || fileExtension === 'gltf')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only GLB and glTF files are allowed.'), false);
    }
  };

const upload = multer({ storage: storage,limits: { fileSize: 20 * 1024 * 1024 } ,fileFilter: fileFilter}).single('file');

app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "index.html"));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(intialPath, "home.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(intialPath, "upload.html"));
});

// Route to handle user registration
app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if (!name.length || !email.length || !password.length) {
        res.json('fill all the fields');
    } else {
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0]);
        })
        .catch(err => {
            if (err.detail.includes('already exists')) {
                res.json('email already exists');
            }
        });
    }
});

// Route to handle user login
app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if (data.length) {
            res.json(data[0]);
        } else {
            res.json('email or password is incorrect');
        }
    });
});

// Route to handle file upload
app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.log("Multer error:", err);
            res.status(500).send('Multer error: ' + err.message);
          } else if (err) {
            console.log("Unknown error:", err);
            res.status(500).send('Unknown error: ' + err.message);
          } else if (!req.file) {
            return res.status(400).send('No file uploaded or file type not allowed.');
          } else {
            console.log("File uploaded successfully");
            res.send('File uploaded successfully');
          }

        const { filename, mimetype, size } = req.file;
        const data = fs.readFileSync(req.file.path);

        try {
            await db("carmodels").insert({
                filename: filename,
                mimetype: mimetype,
                size: size,
                data: data
            });

            // Delete the temporary file after saving it to the database
            fs.unlinkSync(req.file.path);

            res.redirect('/home?message=File saved successfully');
        } catch (error) {
            console.error('Error inserting file into database:', error);
            res.status(500).send('Error uploading file.');
            return;
        }
    });
});

app.listen(3000, () => {
    console.log('listening on port 3000...');
});
