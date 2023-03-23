import Player from "../models/Player.js";
import path   from "path";
import fs     from "fs-extra";
import Team from "../models/Team.js";


export const addPlayer = (req, res) => {
    const team = req.params.team_name;
    res.render("players/addPlayer", { team });
};


export const savePlayer = async(req, res) => {
    const { name, age, position, team} = req.body;
    let errors = [];
    try {
    const imageTempPath = req.file.path; //temporal path 
    const ext = path.extname(req.file.originalname).toLocaleLowerCase(); //get extention from image
    const targetPath = path.resolve(`src/public/upload/teams/${req.body.name}${ext}`);//folder to save image
    //check if the file is an image
    if(ext ===".png" || ext ===".jpg" || ext ===".jpeg" || ext ===".gif")
    {
        
        //save on database

        if(age < 13)
        {
            errors.push({text: "La edad mínima debe ser 13"})
        }
        if(name.length <=0)
        {
            errors.push({text: "Debe ingresar un nombre"})
        }
        if(position === "Seleccionar Posición")
        {
            errors.push({text: "Debe seleccionar una posición"})
        }
        
        if(errors.length > 0)
        {
            res.render("players/addPlayer", {errors});
        }
        else
        {
            await fs.rename(imageTempPath, targetPath); //save image on server folder
            const newPlayer = new Player
            (
                
                {
                    name,
                    age,
                    position,
                    team,
                    image: name + ext,
                }
            );
            await newPlayer.save(); //save the player
            //update the number of players on the team
            const newTeam = await Team.findOne({name: team});
            if(newTeam){
                newTeam.no_players = newTeam.no_players + 1;
                await newTeam.save();
            }else{
                console.log(newTeam);
            }
            
            res.redirect(`/teams/${team}`);
        }

        
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

//search for individual data of players
export const dataPlayer = async(req, res) => {
    try {
        const player = await Player.findOne({name: req.params.player_name})
        console.log(player);
        res.render("players/editPlayer", player);
    } catch (error) {
        console.log(error);
    }
};

export const updatePlayer = async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const { name, age, position, team}= req.body;

        const playerg    = await Player.findOne({name: req.params.player_name});
        const message    = {text: "Jugador actualizado"};
        
       //update data of player (if image was not uploaded and updated)
        if(req.file === undefined)
        {
            const player    = await Player.findOne({name: req.params.player_name});
            player.name     = name;
            player.age      = age;
            player.position = position;
            player.team     = team;
            const stringimg = player.image;
            const extention = stringimg.split(".").pop();

            console.log(extention);   
            //update image name on the server  
            await fs.rename(path.resolve(`src/public/upload/teams/${player.image}`), path.resolve(`src/public/upload/teams/${name + "." + extention}`));
            player.image    = name + "." + extention;

            player.save(); //update data on db
            
        }
        else
        {
            //update data if an image was uploaded
            const imageTempPath = req.file.path; //temporal path 
            const ext = path.extname(req.file.originalname).toLocaleLowerCase(); //get extention from image
            const targetPath = path.resolve(`src/public/upload/teams/${req.body.name}${ext}`);//folder to save image
            
            if(ext ===".png" || ext ===".jpg" || ext ===".jpeg" || ext ===".gif")
            {
                //search for player on db
                const player = await Player.findOne({name: req.params.player_name});
                //save new image on server
                await fs.unlink(path.resolve(`src/public/upload/teams/${player.image}`));

                await fs.rename(imageTempPath, targetPath); //save image on server folder
                //update data of player
                player.name     = name;
                player.age      = age;
                player.position = position;
                player.team     = team;
                player.image    = name + ext;
                player.save();
                
                
            }
            else
            {
                await fs.unlink(imageTempPath); //delete image from temporal folder on server
                res.status(500).json({error: "Solo se permiten imágenes"});
            }
        }
        //res.render("players/editPlayer", playerg, message);
        //res.render("teams/team", model);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

export const deletePlayer = async(req, res) => {
    try {
        //search player
        const splayer = await Player.findOne({name: req.params.player_name})
        //update status
        splayer.status = "baja";
        splayer.save();
        //await fs.unlink(path.resolve(`src/public/upload/teams/${splayer.image}`)); //delete player image 
        
        //LOAD DATA TO RENDER THE PAGE
        //search player team 
        const team = await Team.findOne({name: splayer.team});
        //update number of players
        team.no_players = team.no_players - 1;
        let model  = [{}];
        model.team = team;
        team.save();//save the new number of players
        //search team players
        const players = await Player.find({team: splayer.team, status: "alta"});
        model.players = players;
        
        res.render("teams/team", model);
    } catch (error) {
        console.log(error);
    }
};

//show the form of the downs 
export const bajasJugadores = async(req, res) => {
    try {
        let model = [{}];
        const players = await Player.find({status: "baja"});
        model.players = players;
        console.log(players);
        res.render("players/bajas", model);
    } catch (error) {
        console.log(error);
    }
    
};

//delete a player permanently
export const deleteFullPlayer = async(req, res) => {
    try {
        
        const deletedPlayer = await Player.findOneAndDelete({name: req.params.player_name});
        await fs.unlink(path.resolve(`src/public/upload/teams/${deletedPlayer.image}`)); //delete player image 
        res.redirect("/",);
    } catch (error) {
        console.log(error);
    }
    
};

export const restoredPlayer = async(req, res) => {
    try {
        const player  = await Player.findOne({name: req.params.player_name});
        player.status = "alta";
        

        const team = await Team.findOne({name: player.team});
        team.no_players = team.no_players + 1;
        player.save();
        team.save();
        res.redirect("/");

    } catch (error) {
        console.log(error);
    }
    
};