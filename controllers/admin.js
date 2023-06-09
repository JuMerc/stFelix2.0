import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";

export const AdminController = (req, res) => {
  res.render("layout", { template: "admin" });
};

export const NewAdmin = (req, res) => {
  res.render("layout", { template: "add_admin" });
};

export const AddNewAdmin = (req, res) => {
  const maxSize = 5 * 1024 * 1024;
  const form = new formidable.IncomingForm();
  const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];
  form.parse(req, (err, fields, files) => {
    console.log(fields);

    if (err) {
      console.error(err);
      return res
        .status(500).send("Une erreur est survenue lors de l'upload de l'image.");
    }
    const extension = files.myfile.originalFilename.split(".").pop();
    const oldPath = files.myfile.filepath;
    const newPath = `./public/upload/${files.myfile.newFilename}.${extension}`;

    if (files.myfile.size > maxSize) {
      return res.status(500).send("Image trop volumineuse");
    }
    if (!authorizedExtention.includes(files.myfile.mimetype)) {
      return res.status(500).send("Le fichier n'a pas la bonne extention");
    }
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        console.log(error);
      }
    });

    const img = `/upload/${files.myfile.newFilename}.${extension}`;
    bcrypt.hash(fields.password, 10, function (error, hash) {
      if (error) {
        console.log(error);
      } else {
        const newUser = {
          id: uuidv4(),
          email: fields.email,
          name: fields.name,
          picture: img,
          text: fields.text,
          role: fields.role,
          password: hash,
        };

        pool.query(
          "INSERT INTO users SET ?",[newUser],function (error, result) {
            if (error) {
              console.error(error);
              res.status(500).send("Erreur de base de données");
            } else {
              req.session.isAdmin = true;
              res.redirect("/admin");
            }
          }
        );
      }
    });
  });
};
