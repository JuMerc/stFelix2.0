import pool from "../config/database.js";

export const ContactController =  (req, res) => {
    pool.query("SELECT * FROM infos", (error, infosResult) => {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
          return;
        }
        pool.query("SELECT * FROM horaires ORDER BY ordre", (error, scheduleResult) => {
          if (error) {
            console.error(error);
            res.status(500).send("Erreur de base de données");
            return;
          }
          res.render("layout", {template: "contact",info: infosResult, schedule: scheduleResult});
        });
      });
}