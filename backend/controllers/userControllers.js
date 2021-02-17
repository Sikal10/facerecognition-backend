import colors from "colors";
import bcrypt from "bcryptjs";
import knex from "knex";
import dotenv from "dotenv";

//load environment variables
dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : process.env.DATABASE_PASSWORD,
        database : 'faceapp'
    }
});

const result = await db.select("*").from("users")
console.log("result-------->", result);

// @desc Register a user
// @route POST/api/users/register
// @access Public
export const registerUser = (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    console.log(hash)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            }).then(trx.commit).catch(trx.rollback)
    }).catch(err => res.status(400).json('unable to register'))
};

// @desc Log in a user
// @route POST/api/users/login
// @access public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))

}

// @desc get all users
// @route GET/api/users
// @access public
export const getUsers = async (req, res) => {
    const allUsers = await db.select("*").from("users");
    res.json(allUsers);
}

// @desc get a user by ID
// @route GET/api/users/:id
// @access public
export const getUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await db.select("*").from("users").where({id});
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(404).json("Not Found")
        }
    } catch (err) {
        res.status(404).json("Error getting user")
    }


}

// @desc post an image
// @route POST/api/users/image
// @access private
export const userPhotoUpload = async (req, res) => {
    try {
        const {id} = req.body;
        const entries = await db("users").where("id", "=", id).increment("entries", 1).returning("entries");
        res.json(entries[0]);
    } catch (err) {
        res.status(400).json("unable to get entries");
    }

}