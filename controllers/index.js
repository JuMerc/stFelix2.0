import pool from "../config/database.js";

export const IndexController = (req, res) => {
    pool.query("SELECT img FROM carrousel", (error, imgResults) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
  
      pool.query("SELECT index_text FROM infos", (error, textResults) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
  
        const img = imgResults;
        const text = textResults;
  
        // Récupérer les marques depuis la base de données
        pool.query("SELECT * FROM marques", (error, brandResults) => {
          if (error) {
            console.error(error);
            res.status(500).send("Erreur de base de données");
            return;
          }
  
          // Envoyer les résultats à la vue EJS pour affichage
          res.render('layout', { template: 'index', img: img, text: text, brands: brandResults });
        });
      });
    });
  };
 