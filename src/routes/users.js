import { Router } from "express";
import { logged_in, loginUser, logout, registerUser, saveUser } from "../controllers/userControllers.js";

const router = Router(); 

//show the form to register a new user 
router.get("/users/signup", registerUser);
//show the form to login
router.get("/users/signin", loginUser);
//register a new user
router.post("/users/signup", saveUser);
//log in 
router.post("/users/signin", logged_in); 
//log out
router.get("/users/logout", logout);

export default router; 