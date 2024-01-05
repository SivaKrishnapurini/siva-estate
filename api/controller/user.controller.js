const UserModel = require('../models/user.models.js')
const ErrorHandler = require('../utils/ErrorHandler.js')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const hashPassword = bcryptjs.hashSync(password, 10)
        const existUserData = await UserModel.findOne({ email })
        if (existUserData) {
            // console.log(existUserData)
            // return res.status(401).json('user already exist')
            next(ErrorHandler(401, 'User Already Exists'))
        }
        const createNewData = await UserModel({ email, name, password: hashPassword })
        await createNewData.save()

        return res.status(200).json('successfully created')
    } catch (err) {
        // return res.status(400).json(err)
        console.log(err.message)
        next(err)
    }

}

const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const existUser = await UserModel.findOne({ email })


        if (!existUser) return next(ErrorHandler(401, 'User Not Found'))
        const comparePassword = bcryptjs.compareSync(password, existUser.password)
        if (!comparePassword) return next(ErrorHandler(401, "password not correct"))


        const jsonToken = jwt.sign({ id: existUser._id }, process.env.JSON_WEB_TOKEN)
        const { password: pass, ...rest } = existUser._doc
        res.cookie('sadfnkandsi23', jsonToken, { httpOnly: true }).status(200).json(rest)

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

const googleSignIn = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JSON_WEB_TOKEN)
            const { password: pass, ...rest } = existingUser._doc
            res
                .cookie('sadfnkandsi23', token, { httpOnly: true })
                .status(200)
                .json(rest)
        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const convertHaspassword = bcryptjs.hashSync(generatePassword, 10)
            const createNewData = await UserModel({ name, email, avatar, password: convertHaspassword })
            await createNewData.save()
            const token = jwt.sign({ id: createNewData._id }, process.env.JSON_WEB_TOKEN)
            const { password: pass, ...rest } = createNewData._doc
            res.cookie('sadfnkandsi23', token, { httpOnly: true }).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }

}

const profileUpdate = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(ErrorHandler(401, "You can't update details you update only your details"))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUserData = await UserModel.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        const { password: pass, ...rest } = updateUserData._doc
        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}


const logOut = async (req, res, next) => {
    try {
        if (req.user.id !== req.body.id) return next(ErrorHandler(401, 'you only logout user login only'))
        req.clearCookie('sadfnkandsi23')
        res.status(200).json('logout successfully')
    } catch (error) {
        next(error)
    }
}

module.exports = { signup, signin, googleSignIn, profileUpdate, logOut }