import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {randomBytes} from "crypto"

const age = process.env.TOKEN_EXPIRY || 1000 * 60 * 60 * 24;

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const doesUserExist = await User.exists({ email })

        if (!doesUserExist) {
            const hashedPassword = await bcrypt.hash(password, 10)

            const newUser = new User ({
                username,
                email,
                password: hashedPassword
            })

            newUser.profileImage = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(newUser.username)}`

            await newUser.save()

            res.status(201).json({ message: "User registered successfully" });
        } else {
            res.status(409).json({ message: "User with the same email address already exists" })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to reegister user!" });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email: email });

        if (!validUser) {
            res.status(404).json({ message: "User with the email not found" })
        } else {
            const isPasswordValid = await bcrypt.compare(password, validUser.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid password" })
            } else {

                const token = jwt.sign(
                    { id: validUser._id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: age }
                );


                await validUser.populate('wishlist')
                const { password, ...userInfo } = validUser._doc
                
                res
                    .status(200)
                    .cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: age,
                    })
                    .json({
                        message: "User logged in successfully",
                        userInfo
                    });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to signin user!" });
    }
}

const googleLogin = async (req, res) => {
    const { email, username, profileImage } = req.body;

    try {
        const user = await User.findOne({ email })

        if (user) {
        
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: age }
            );

            await user.populate('wishlist')
            const { password, ...userInfo } = user._doc

            res
                .status(200)
                .cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: age,
                })
                .json({
                    message: "User logged in successfully",
                    userInfo
                });
        } else {

            const generatedPassword = randomBytes(16).toString('hex');
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            const newUser = await User.create({
                username,
                email,
                password : hashedPassword,
                profileImage
            })

            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: age }
            );


            const { password, ...userInfo } = newUser._doc

            res
                .status(200)
                .cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: age,
                })
                .json({
                    message: "User logged in successfully",
                    userInfo
                });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to signin user!" });
    }
}

const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
}


export { register, login, googleLogin, logout }
