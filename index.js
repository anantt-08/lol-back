//node index
const express = require('express');
const mongoose= require('mongoose');
const bodyParser=require('body-parser');
const cors = require('cors');
const path = require('path');
const passport=require('passport');
// Initialize the app
const app = express();

/* what is body bodyParser ?

To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.

body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.

The middleware was a part of Express.js earlier but now you have to install it separately.

This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request. Install body-parser using NPM as shown below.
npm install body-parser --save
 */


app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
/* app.use(bodyParser.json()) basically tells the system that you want json to be used.

bodyParser.urlencoded({extended: ...}) basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
If extended is false, you can not post "nested object"

person[name] = 'cw'

// Nested Object = { person: { name: cw } }
If extended is true, you can do whatever way that you like. */
// Cors Middleware
app.use(cors());
// Seting up the static directory
app.use(express.static(path.join(__dirname, 'public')));
// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/passport')(passport);

// Bring in the Database Config and connect with the database
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {
    useUnifiedTopology:true,useNewUrlParser: true
}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`)
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// app.get('/', (req, res) => {
//     return res.send("<h1>Hello World</h1>");
// });
// Bring in the Users route
const topics=require("./routes/api/topics")
const users = require('./routes/api/users');
const courses = require('./routes/api/courses');
const batches= require("./routes/api/batches");
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/topics', topics);
app.use("/api/batches",batches);
// console.log(app);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

// Cors Middleware
app.use(cors());