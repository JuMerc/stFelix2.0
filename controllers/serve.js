import pool from "../config/database.js";

export const ServeController = (req, res) => {
    pool.query("SELECT * FROM categories", (error, categoriesResult) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query("SELECT * FROM prestations", (error, prestationsResult) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
        res.render("layout", { template: "serve", categories: categoriesResult, prestations: prestationsResult });
      });
    });
  };