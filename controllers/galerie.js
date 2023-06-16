import pool from "../config/database.js";

export const GalerieController =  (req, res) => {
    pool.query("SELECT * FROM galerie ORDER BY date", (error, galerieResult, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query("SELECT * FROM infos", (error, infosResult) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
        res.render('layout', { template: 'galerie', galerie: galerieResult, info: infosResult  });
      });
      
    });
}