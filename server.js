const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
//const bodyparser = require('body-parser');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');

// app.use(bodyparser.urlencoded({extended: false}));
//app.use(bodyparser.json());
// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const knex = require('knex');
const { response } = require('express');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '1362',
        database: 'facedetect'
    }
});



app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req, res) => {
    let found = false;
    db.select('*').from('users').where({ id: req.params.id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Nott Foundd')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
    // if (!found) {
    //     res.status(400).json('not found');
    // }
});

app.put('/image', (req, res) => {
    db('users').where('id', '=', req.body.id).increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to count'))


})

app.listen(process.env.PORT || 3000, () => {
    console.log(`port correct${process.env.PORT}`);
});