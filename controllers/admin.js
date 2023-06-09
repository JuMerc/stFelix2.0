import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";

export const AdminController = (req, res) => {
    res.render('layout', {template: 'admin'});
}

export const NewAdmin = (req, res) => {
    res.render('layout', {template: 'add_admin'});
}

export const AddNewAdmin = (req, res) => {
    bcrypt.hash(req.body.password, 10, function (error, hash) {
      if (error) {
        console.log(error);
      } else {
        const newUser = {
          id: uuidv4(),
          email: req.body.email,
          name : req.body.name,
          picture : req.body.picture,
          text: req.body.text,
          role: req.body.role,
          password: hash,
        };
  
        pool.query("INSERT INTO users SET ?",[newUser],function (error, result) {
            if (error) {
              console.error("bibi"+error);
              res.status(500).send("Erreur de base de données");
            } else {
              req.session.isAdmin = true;
              res.redirect("/admin");
            }
          }
        );
      }
    });
  };