const express = require ('express')
const mongoose = require ('mongoose')
const bodyParser = require ('body-parser')
const Cors = require ('cors')
const path = require('path')
const passport = require ('passport')
const app = express()

const users = require ('./routes/api/user')



app.use(Cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(passport.initialize())

require("./config/Passport") (passport)

const db = require ('./config/keys').MONGO_URL
mongoose.connect(db, {useNewUrlParser:true,useUnifiedTopology: true})//Connect MongoDB
.then(() => console.log("Mongo successful connected"))
.catch(err => console.log(err.message));

app.use("/api/users/",users)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server up and running at ${PORT}`))