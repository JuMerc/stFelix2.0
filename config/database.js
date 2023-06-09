import mysql from "mysql";

let pool  = mysql.createPool({
  connectionLimit : 10000,
    host: "db.3wa.io",// on rentre l'hôte l'adresse url où se trouve la bdd
    user: "julienmercourt", // identifiant BDD
    password: "a31b900e5340a13471ddd22fc55bb8dd", // le password
    database: "julienmercourt_APSstFelix", // nom de la base de donnée
});

export default pool;