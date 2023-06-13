import pool from "../config/database.js";

export default (req, res) => {
    pool.query(
        "SELECT img FROM carrousel", function (error, img, result) {
          if (error) {
            console.error(error);
            res.status(500).send("Erreur de base de données");
          } else {
            res.render('layout', {template: 'index', img: img});
          }
        }
      );
}