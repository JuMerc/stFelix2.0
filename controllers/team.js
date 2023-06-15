import pool from "../config/database.js";

export const TeamController = (req, res) => {
    // Requête pour récupérer les utilisateurs en fonction de leur rôle "main" en premier, puis en fonction de leur date de création
    let sql = "SELECT name, picture, text FROM users ORDER BY role = 'main' DESC, date";
  
    pool.query(sql, (error, users, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
  
      res.render('layout', { template: 'team', users: users });
    });
  };