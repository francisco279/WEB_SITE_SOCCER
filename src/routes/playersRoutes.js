import { Router } from "express";
import { addPlayer, bajasJugadores, dataPlayer, deleteFullPlayer, deletePlayer, restoredPlayer, savePlayer, updatePlayer } from "../controllers/playersControllers.js";

const router = Router(); 

router.post("/players/add/:team_name", addPlayer); //show form to save player on db

router.post("/players/add", savePlayer); //save player on db
router.get("/players/:player_name", dataPlayer);//show page to update player data
router.post("/players/update/:player_name", updatePlayer);//update player data
router.post("/players/delete/:player_name", deletePlayer); //delete a player
router.get("/jugadores/bajas", bajasJugadores);
router.post("/players/delete/:player_name/completed", deleteFullPlayer);
router.post("/players/restore/:player_name", restoredPlayer);//restor a player 
export default router; 