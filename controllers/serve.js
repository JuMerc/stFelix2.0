import pool from "../config/database.js";

export const ServeController = (req, res) => {
    pool.query("SELECT * FROM Category ORDER BY pos", (error, categoriesResult) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query("SELECT * FROM Benefit ORDER BY pos", (error, prestationsResult) => {
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
          res.render("layout", { template: "serve", category: categoriesResult, benefit: prestationsResult, info: infosResult });
        });
      });
    });
  };