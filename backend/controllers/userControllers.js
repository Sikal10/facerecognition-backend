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

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passcode = await bcrypt.hash(password, salt)
        console.log("passcode-------->", passcode)

        if (!name || !email || !password) {
            throw Error("Please enter a valid credential")
        }

        const response = await db("users").returning("*").insert({
            email,
            name,
            joined: new Date()
        });
        await res.json(response[0]);

    } catch (err) {
        res.status(400).json("unable to register");
    }

}

// @desc Log in a user
// @route POST/api/users/login
// @access public
export const loginUser = (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json({msg: "Error logging in"})
    }
}

// @desc get all users
// @route GET/api/users
// @access public
export const getUsers = (req, res) => {
    res.json(database.users);
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
export const userPhotoUpload = (req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        console.log(user)
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries)
        }
    });
    if (!found) {
        return res.status(400).json("not found")
    }
}