import pool from "../config/database.js";

export const IndexController = (req, res) => {
    pool.query("SELECT img FROM carrousel", function (error, imgResults) {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
  
      pool.query("SELECT index_text FROM infos", function (error, textResults) {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
  
        const img = imgResults;
        const text = textResults;
  
        res.render('layout', { template: 'index', img: img, text: text });
      });
    });
  };