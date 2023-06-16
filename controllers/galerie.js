import pool from "../config/database.js";

export const GalerieController =  (req, res) => {
    let sql = "SELECT * FROM galerie ORDER BY date";
  
    pool.query(sql, (error, galerieResult, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
  
      res.render('layout', { template: 'galerie', galerie: galerieResult });
    });
}