import mysql from "mysql";
import dotenv from 'dotenv';
dotenv.config();
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
let pool  = mysql.createPool({
  connectionLimit : 10000,
    host: dbHost,
    user: dbUser, 
    password: dbPassword, 
    database: "julienmercourt_APSstFelix", // nom de la base de donnée
});

export default pool;