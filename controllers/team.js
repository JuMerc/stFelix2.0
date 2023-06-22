import pool from "../config/database.js";

export const TeamController = (req, res) => {
    pool.query("SELECT name, picture, text FROM User ORDER BY role = 'main' DESC, date", (error, users, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query("SELECT * FROM Info", (error, infosResult) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
        res.render('layout', { template: 'team', users: users, info: infosResult });
      });
    });
  }; 