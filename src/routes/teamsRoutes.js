import { Router } from "express";
import { addTeam, deleteTeam, editTeam, saveTeam, showTeam, showTeams, updateTeam } from "../controllers/teamsControllers.js";
const router = Router(); 

//show the form to register a new user 
router.get("/teams/add", addTeam);
//save team on database
router.post("/teams/add", saveTeam);
router.get("/", showTeams); //show all the teams on the initial page
router.get('/teams/:name_team', showTeam);
router.get("/teams/update/:name_team", updateTeam);//show form to update team data
router.post("/teams/update/:name_team", editTeam);
router.post("/teams/delete/:name_team", deleteTeam);



export default router; 