import pool from "../config/database.js";

export const ServeController = (req, res) => {
    pool.query("SELECT * FROM categories ORDER BY ordre", (error, categoriesResult) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query("SELECT * FROM prestations ORDER BY ordre", (error, prestationsResult) => {
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
          res.render("layout", { template: "serve", category: categoriesResult, benefit: prestationsResult, info: infosResult });
        });
      });
    });
  };