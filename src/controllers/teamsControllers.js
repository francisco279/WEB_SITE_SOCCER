import path from "path";
import fs   from "fs-extra";
import Team from "../models/Team.js";
import Player from "../models/Player.js";

export const addTeam = (req, res) => {
    try {
        res.render("teams/newTeam");
    } catch (error) {
        console.log(error);
    }
};

export const saveTeam = async(req, res) => {
    console.log(req.body);
    try {
    const imageTempPath = req.file.path; //temporal path 
    const ext = path.extname(req.file.originalname).toLocaleLowerCase(); //get extention from image
    const targetPath = path.resolve(`src/public/upload/${req.body.name}${ext}`);//folder to save image
    //check if the file is an image
    if(ext ===".png" || ext ===".jpg" || ext ===".jpeg" || ext ===".gif")
    {
        await fs.rename(imageTempPath, targetPath); //save image on server folder
        //save on database
        const newTeam = new Team
        (
            
            {
                name     : req.body.name,
                category : req.body.category,
                image    : req.body.name + ext,
            }
        );
        await newTeam.save();
        res.redirect("/");
    }
    else
    {
        await fs.unlink(imageTempPath); //delete image from temporal folder on server
        res.status(500).json({error: "Solo se permiten imágenes"});
    }
    } catch (error) {
        console.log(error);
    }

    
    
};

export const showTeams = async(req, res) => {
    try {
        const teams      = await Team.find().sort({timestamp: -1}); //consult all the images
        let model = {images: []};
        model.images = teams
        console.log(model);
        res.render("index",  model); //pass tbe images to the index view
    } catch (error) {
        console.log(error);
    }
    
};

export const showTeam = async(req, res) => {
    try {
        //show team data
        const team = await Team.findOne({name: req.params.name_team});
        let model = [{}];
        model.team = team;
        //show players
        const players = await Player.find({team: req.params.name_team, status: "alta"});
        model.players = players;


        console.log(model);
        res.render("teams/team", model);
    } catch (error) {
        console.log(error);
    }
    
};

//display data in a team form to update it 
export const updateTeam = async(req, res) => {
    try {
        const team = await Team.findOne({ name: req.params.name_team });
        console.log(team);
        res.render("teams/editTeam", team)
    } catch (error) {
        console.log(error);
    }
    
};

export const editTeam = async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const { name, category}= req.body;
        
       //update data of team (if image was not uploaded and updated)
        if(req.file === undefined)
        {
            const team      = await Team.findOne({name: req.params.name_team});

            team.name       = name;
            team.category   = category;
            const stringimg = team.image;
            const extention = stringimg.split(".").pop();
            
            console.log(extention);   
            //update image name on the server  
            await fs.rename(path.resolve(`src/public/upload/${team.image}`), path.resolve(`src/public/upload/${name + "." + extention}`));
            team.image    = name + "." + extention;
            //update name of team on players
            const filter = { team: req.params.name_team};
            const update = { $set: { team: name } };
            const jugador = await Player.updateMany(filter, update);
           
            console.log(jugador);
            team.save(); //update data on db
            
            
        }
        else
        {
            //update data if an image was uploaded
            const imageTempPath = req.file.path; //temporal path 
            const ext = path.extname(req.file.originalname).toLocaleLowerCase(); //get extention from image
            const targetPath = path.resolve(`src/public/upload/${req.body.name}${ext}`);//folder to save image
            
            if(ext ===".png" || ext ===".jpg" || ext ===".jpeg" || ext ===".gif")
            {
                //search for player on db
                const team = await Team.findOne({name: req.params.name_team});
                
                //save new image on server
                await fs.unlink(path.resolve(`src/public/upload/${team.image}`));

                await fs.rename(imageTempPath, targetPath); //save image on server folder
                //update data of player
                team.name       = name;
                team.category   = category;
                team.image      = name + ext;
                //update name of team on players
                const filter = { team: req.params.name_team};
                const update = { $set: { team: name } };
                const jugador = await Player.updateMany(filter, update);
                team.save(); //update data on db
            }
            else
            {
                await fs.unlink(imageTempPath); //delete image from temporal folder on server
                res.status(500).json({error: "Solo se permiten imágenes"});
            }
        } 
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

//function to delete a team
export const deleteTeam = async(req, res) => {
    try {
        //delete team
        await Team.findOneAndDelete({name: req.params.name_team});
        //delete the players of the team
        const filter = { team: req.params.name_team};
        await Player.deleteMany(filter);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};