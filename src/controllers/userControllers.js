import passport from "passport";
import User from "../models/User.js";

export const registerUser = (req, res) => {
    res.render("users/signUp");
};

export const loginUser = (req, res) => {
    res.render("users/signIn");
};

export const logged_in = passport.authenticate("local", {
    failureRedirect: "/users/signin",
    successRedirect: "/", 
});
 
export const saveUser = async(req, res) => {
    const { name, email, password, confirm_password } = req.body;

    //array of errors
    let errors = [];
    if(name.length <=0)
    {
        errors.push({text: "Debe ingresar un nombre"})
    }
    if(password != confirm_password)
    {
        errors.push({text: "Las contraseñas no coinciden"});
    }
    if(password.length < 4)
    {
        errors.push({text: "La contraseña debe tener al menos 4 carácteres"})
    }
    if(email.length <= 0)
    {
        errors.push({text: "Debe ingresar un correo"})
    }
    //search email on database
    const emailUser = await User.findOne({ email: email});
    if(emailUser)
    {
        errors.push({text: "El correo ya esta en uso"})
    }

    if(errors.length > 0)
    {
        res.render("users/signUp", { errors, name, email, password, confirm_password})
    }
    else
    {
            const newUser    = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.redirect("/users/signin");
    }
};

export const logout = async(req, res, next) => {
    await req.logOut((err) => {
        if (err) return next(err);
        res.redirect("/users/signin");
    });
    
}