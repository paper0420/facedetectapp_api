

const handleRegister = (req, res,db,bcrypt) => {
    //const { email,name, password} = req.body;
    if (!req.body.email || !req.body.name || !req.body.password){
        return res.status(400).json('Incorrect from submission');
    }
    const hash = bcrypt.hashSync(req.body.password, salt);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: req.body.email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: req.body.name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })

        .catch(err => res.status(400).json('Unable to register'))
}



module.exports = {
    handleRegister: handleRegister
}