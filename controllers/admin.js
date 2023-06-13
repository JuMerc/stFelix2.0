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
        .status(500)
        .send("Une erreur est survenue lors de l'upload de l'image.");
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

    const img = `/team/${files.myfile.newFilename}.${extension}`;
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
          "INSERT INTO users SET ?",
          [newUser],
          function (error, result) {
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
// export const UpdateCarrouselPicture = (req, res) => {
//   const maxSize = 5 * 1024 * 1024;
//   const form = new formidable.IncomingForm();
//   const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];
  
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
//     }
    
//     for (let i = 1; i <= 5; i++) {
//       const carrouselFile = files[`carrousel${i}`];
      
//       if (carrouselFile && carrouselFile.originalFilename) {
//         const extension = carrouselFile.originalFilename.split(".").pop();
//         const oldPath = carrouselFile.filepath;
//         const newPath = `./public/carrousel/${carrouselFile.newFilename}.${extension}`;
        
//         if (!authorizedExtention.includes(carrouselFile.mimetype)) {
//           return res.status(500).send("Le fichier n'a pas la bonne extension");
//         }

//         if (carrouselFile.size > maxSize) {
//           return res.status(500).send("Image trop volumineuse");
//         }
        
//         fs.rename(oldPath, newPath, (error) => {
//           if (error) {
//             console.log(error);
//           }
//         });
        
//         const img = `/carrousel/${carrouselFile.newFilename}.${extension}`;
        
//         pool.query(
//           "INSERT INTO carrousel (id, img) VALUES (?, ?)",
//           [uuidv4(), img],
//           function (error, result, fields) {
//             console.log(error);
//           }
//         );
//       }
//     }
    
//     res.redirect("/admin");
//   });
// };
//****************************************************AJOUT DE 5 PHOTOS POUR TESTS************************************************** */

export const UpdateCarrouselPicture = (req, res) => {
  const maxSize = 5 * 1024 * 1024;
  const form = new formidable.IncomingForm();
  const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
    }

    pool.query("SELECT id, img FROM carrousel", (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Une erreur est survenue lors de la récupération des anciens uploads.");
      }
      
      for (let i = 0; i < results.length; i++) {
        
        const row = results[i];
        const carrouselFile = files[`carrousel${i}`];
        if (carrouselFile && carrouselFile.originalFilename) {
          const extension = carrouselFile.originalFilename.split(".").pop();
          const oldPath = carrouselFile.filepath;
          const newPath = `./public/carrousel/${carrouselFile.newFilename}.${extension}`;
          if (!authorizedExtention.includes(carrouselFile.mimetype)) {
            return res.status(500).send("Le fichier n'a pas la bonne extension");
          }
      
          if (carrouselFile.size > maxSize) {
            return res.status(500).send("Image trop volumineuse");
          }
      
          // Supprimer l'ancien fichier
          const oldImagePath = `./public${row.img}`;
          fs.unlinkSync(oldImagePath);
      
          fs.rename(oldPath, newPath, (error) => {
            if (error) {
              console.log(error);
            }
          });
      
          const img = `/carrousel/${carrouselFile.newFilename}.${extension}`;
      
          // Mettre à jour l'enregistrement avec le nouvel URL
          pool.query(
            "UPDATE carrousel SET img = ? WHERE id = ?",
            [img, row.id],
            function (error, result, fields) {
              if (error) {
                console.log(error);
              }
            }
          );
        }
      }
      res.redirect("/admin");
    });
  });
};
