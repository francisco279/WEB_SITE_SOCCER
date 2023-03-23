import mongoose from "mongoose";

//connect to mongoDB
const conecta = async() => {
    try 
    {
        const con = await mongoose.connect("mongodb://localhost/futbol"); //connect to mongodb
        console.log("db is connected");
    } 
    catch (error) 
    {
        console.log(error);
    }
}

export default conecta;