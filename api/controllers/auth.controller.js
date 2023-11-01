import User from "../models/user.model.js";
import {errorHandler} from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup  = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword})
    try {
        await newUser.save()
        res.status(201).json({message:"User created Successfully"})
        
    } catch (error) {
        console.log(errorHandler);
        next(error)
    }
}       


export const signin  = async (req, res, next) => {
    const {email, password} = req.body
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, "User not Found"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) {
            return next(errorHandler(401, "Invalid Credentials"))
        }

        const {password: pass, ...rest} = validUser._doc

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}


export const google = async (req, res, next) => {
    try {
        const {email, username} = req.body
        const user = await User.findOne({email})
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly:true
            }).json(rest)
        } else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            
            const newUser = await User.create({
                username: username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), 
                email, 
                password: hashedPassword,
                avatar: req.body.photoUrl
            })
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc            
            res.status(201).cookie('access_token', token, {
                httpOnly:true
            }).json(rest)
        }

    } catch (error) {
        next(error)
    }
}


export const signout = async(req, res, next) => {
    try {
        res.status(200).clearCookie('access_token').json("User Logout Successfully")

    } catch (error) {
        next(error)
    }
}