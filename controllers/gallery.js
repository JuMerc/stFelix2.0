import pool from "../config/database.js";

export const GalleryController =  (req, res) => {
    pool.query("SELECT * FROM Gallery ORDER BY date", (error, galerieResult, fields) => {
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
        res.render('layout', { template: 'gallery', galerie: galerieResult, info: infosResult  });
      });
      
    });
}