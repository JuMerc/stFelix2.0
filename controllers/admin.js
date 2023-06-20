import pool from "../config/database.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";

export const AdminController = (req, res) => {
  pool.query("SELECT * FROM Brand", (error, brandResults) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }
    pool.query("SELECT * FROM Category", (error, categoriesResult) => {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      pool.query(
        "SELECT * FROM Benefit ORDER BY id",
        (error, benefitResult) => {
          if (error) {
            console.error(error);
            res.status(500).send("Erreur de base de données");
            return;
          }
          pool.query("SELECT * FROM User", (error, adminResult) => {
            if (error) {
              console.error(error);
              res.status(500).send("Erreur de base de données");
              return;
            }
            pool.query("SELECT * FROM Gallery ORDER BY date", (error, galerieResult) => {
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
                pool.query("SELECT * FROM Schedule ORDER BY pos", (error, scheduleResult) => {
                  if (error) {
                    console.error(error);
                    res.status(500).send("Erreur de base de données");
                    return;
                  }
                  pool.query("SELECT * FROM Carousel", (error, carrouselResult) => {
                    if (error) {
                      console.error(error);
                      res.status(500).send("Erreur de base de données");
                      return;
                    }
                    res.render("layout", {template: "admin",brands: brandResults,category: categoriesResult,benefit: benefitResult,admin: adminResult, 
                    galerie: galerieResult, info: infosResult, schedule: scheduleResult, carrousel: carrouselResult});
                  });
                });
              });
            });
          });
        }
      );
    });
  });
};

export const NewAdmin = (req, res) => {
  pool.query("SELECT * FROM User", (error, adminResult) => {
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
      res.render("layout", { template: "add_admin", admin: adminResult, info: infosResult });
    });
    
  });
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
    const newPath = `./public/team/${files.myfile.newFilename}.${extension}`;

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
          "INSERT INTO User SET ?",
          [newUser],
          function (error, result) {
            if (error) {
              console.error(error);
              res.status(500).send("Erreur de base de données");
            } else {
              req.session.isAdmin = true;
              res.redirect("/");
            }
          }
        );
      }
    });
  });
};

export const DeleteAdmin = (req, res) => {
  let id = req.params.id;
  // Requête pour récupérer le chemin de l'image de la marque à supprimer
  let selectSql = "SELECT picture FROM User WHERE id = ?";

  pool.query(selectSql, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la marque",
      });
      return;
    }
    // Vérifier s'il y a un résultat
    if (results.length > 0) {
      let imageFilePath = `./public${results[0].picture}`;

      // Supprimer le fichier d'image correspondant
      fs.unlink(imageFilePath, function (error) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: "Erreur lors de la suppression de la photo de profil",
          });
          return;
        }

        // Requête de suppression en BDD
        let deleteSql = "DELETE FROM User WHERE id = ?";

        pool.query(deleteSql, [id], function (error, result, fields) {
          if (error) {
            console.log(error);
            res.status(500).send({
              error: "Erreur lors de la suppression de l'admin",
            });
          } else {
            res.status(204).send();
          }
        });
      });
    } else {
      // Aucun résultat trouvé
      res.status(404).send({ error: "La marque n'a pas été trouvée" });
    }
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
      return res
        .status(500)
        .send("Une erreur est survenue lors de l'upload de l'image.");
    }

    pool.query("SELECT id, img FROM Carousel", (error, results) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send(
            "Une erreur est survenue lors de la récupération des anciens uploads."
          );
      }

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const carrouselFile = files[`carrousel${i}`];
        if (carrouselFile && carrouselFile.originalFilename) {
          const extension = carrouselFile.originalFilename.split(".").pop();
          const oldPath = carrouselFile.filepath;
          const newPath = `./public/carrousel/${carrouselFile.newFilename}.${extension}`;
          if (!authorizedExtention.includes(carrouselFile.mimetype)) {
            return res
              .status(500)
              .send("Le fichier n'a pas la bonne extension");
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
            "UPDATE Carousel SET img = ? WHERE id = ?",
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

export const UpdateIndexText = (req, res) => {
  const indexText = req.body.indexText; // Récupérer le nouveau texte à partir du corps de la requête
  // Mettre à jour le texte dans la base de données
  pool.query(
    "UPDATE Info SET index_text = ?",
    [indexText],
    function (error, results) {
      if (error) {
        console.error(error);
        res.status(500).send("Erreur de base de données");
        return;
      }
      // Rediriger vers une autre page ou effectuer une autre action après la mise à jour
      res.redirect("/");
    }
  );
};

export const AddBrand = (req, res) => {
  const form = new formidable.IncomingForm();
  const maxSize = 5 * 1024 * 1024;

  // Définir les types de fichiers d'image autorisés
  const authorizedExtensions = ["image/jpeg", "image/png", "image/jpg"];

  // Analysez la requête et récupérez les champs et les fichiers
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("Une erreur est survenue lors de l'analyse du formulaire.");
    }

    const extension = files.newbrand.originalFilename.split(".").pop();
    const oldPath = files.newbrand.filepath;
    const newPath = `./public/brand_img/${files.newbrand.newFilename}.${extension}`;

    // Vérifier si tous les champs requis sont présents
    if (!files.newbrand || !fields.brandText || !fields.title) {
      return res.status(400).send("Veuillez remplir tous les champs requis.");
    }

    // Vérifier la taille de l'image
    if (files.newbrand.size > maxSize) {
      return res
        .status(500)
        .send("La taille de l'image dépasse la limite autorisée.");
    }

    // Vérifier le format de l'image
    if (!authorizedExtensions.includes(files.newbrand.mimetype)) {
      return res.status(500).send("Le format de l'image n'est pas autorisé.");
    }

    const brandId = uuidv4();

    // Déplacer le fichier vers le dossier de destination avec le nouveau nom
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        console.log(error);
      }
    });
    const img = `/brand_img/${files.newbrand.newFilename}.${extension}`;
    const brandText = fields.brandText;
    const title = fields.title;
    pool.query("INSERT INTO Brand (id, title, img, text) VALUES (?, ?, ?, ?)",
      [brandId, title, img, brandText],
      (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .send("Une erreur est survenue lors de l'ajout de la marque.");
        }
        res.redirect("/admin");
      }
    );
  });
};
export const DeleteBrand = (req, res) => {
  // On récupère l'id de la marque à supprimer, il a été passé en paramètre de l'url
  let id = req.params.id;
  // Requête pour récupérer le chemin de l'image de la marque à supprimer
  let selectSql = "SELECT img FROM Brand WHERE id = ?";

  pool.query(selectSql, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la marque",
      });
      return;
    }
    // Vérifier s'il y a un résultat
    if (results.length > 0) {
      let imageFilePath = `./public${results[0].img}`;

      // Supprimer le fichier d'image correspondant
      fs.unlink(imageFilePath, function (error) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: "Erreur lors de la suppression de l'image",
          });
          return;
        }

        // Requête de suppression en BDD
        let deleteSql = "DELETE FROM Brand WHERE id = ?";

        pool.query(deleteSql, [id], function (error, result, fields) {
          if (error) {
            console.log(error);
            res.status(500).send({
              error: "Erreur lors de la suppression de la marque",
            });
          } else {
            res.status(204).send();
          }
        });
      });
    } else {
      // Aucun résultat trouvé
      res.status(404).send({ error: "La marque n'a pas été trouvée" });
    }
  });
};

export const AddCategory = (req, res) => {
  const input = {
    category: req.body.categorie,
    ordre: req.body.categoryOrder,
    id: uuidv4(),
  };

  if (!input.category) {
    res.status(400).send("Veuillez saisir une catégorie");
    return;
  }

  // Requête d'insertion en BDD avec l'ID UUID
  const sql = "INSERT INTO Category (id, title, pos) VALUES (?, ?, ?)";

  pool.query(sql, [input.id, input.category, input.ordre], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur lors de l'ajout de la catégorie");
    } else {
      res.redirect("/admin");
    }
  });
};

export const AddBenefit = (req, res) => {
  const { category, prestation, price, benefitOrder } = req.body;
  const id = uuidv4();
  // Requête pour insérer la prestation dans la table "prestations"
  const sql =
    "INSERT INTO Benefit (id, title, price, category_id, order) VALUES (?, ?, ?, ?, ?)";
  const values = [id, prestation, price, category, benefitOrder];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }

    res.redirect("/admin"); // Rediriger vers la page d'administration après l'ajout réussi
  });
};

export const UpdateCategory = (req, res) => {
  const { updateCategory, updateCategoryOrder, categoryId } = req.body;

  const sql = "UPDATE Category SET title = ?, pos = ? WHERE id = ?";
  const values = [updateCategory, updateCategoryOrder, categoryId];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }
    res.redirect("/admin"); // Redirigez vers la page souhaitée après la mise à jour
  });
};

// Contrôleur pour mettre à jour une prestation
export const UpdateBenefit = (req, res) => {
  const {
    updateBenefitTitle,
    updateBenefitPrice,
    updateBenefitOrder,
    benefitId,
  } = req.body;
  const sql = "UPDATE Benefit SET title = ?, price = ?, pos = ? WHERE id = ?";
  const values = [
    updateBenefitTitle,
    updateBenefitPrice,
    updateBenefitOrder,
    benefitId,
  ];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }
    res.redirect("/admin"); // Redirigez vers la page souhaitée après la mise à jour
  });
};

export const DeleteCategory = (req, res) => {
  let id = req.params.id;
  // Requête pour récupérer le chemin de l'image de la marque à supprimer

  let deleteSql = "DELETE FROM Category WHERE id = ?";

  pool.query(deleteSql, [id], function (error, result, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la catégorie",
      });
    } else {
      res.status(204).send();
    }
  });
};

export const DeleteBenefit = (req, res) => {
  let id = req.params.id;
  // Requête pour récupérer le chemin de l'image de la marque à supprimer
  
  let deleteSql = "DELETE FROM Benefit WHERE id = ?";

  pool.query(deleteSql, [id], function (error, result, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la catégorie",
      });
    } else {
      res.status(204).send();
    }
  });
};
export const AddPictureInGallery = (req, res) => {
  const maxSize = 5 * 1024 * 1024;
  const form = new formidable.IncomingForm();
  const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
    }
    const extension = files.newpicture.originalFilename.split(".").pop();
    const oldPath = files.newpicture.filepath;
    const newPath = `./public/gallery/${files.newpicture.newFilename}.${extension}`;

    if (files.newpicture.size > maxSize) {
      return res.status(500).send("Image trop volumineuse");
    }
    if (!authorizedExtention.includes(files.newpicture.mimetype)) {
      return res.status(500).send("Le fichier n'a pas la bonne extention");
    }
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        console.log(error);
      }
    });

    const img = `/gallery/${files.newpicture.newFilename}.${extension}`;
    const newPicture = {
      id: uuidv4(),
      img: img,
      name: fields.name,
    };

    pool.query("INSERT INTO Gallery (id, img, name) VALUES (?, ?, ?)",
    [newPicture.id, newPicture.img, newPicture.name],
      function (error, result) {
        if (error) {
          console.error(error);
          res.status(500).send("Erreur de base de données");
        } else {
          res.redirect("/admin");
        }
      }
    );
  });
};
export const DeletePictureInGallery = (req, res) => {
  let id = req.params.id;
  let selectSql = "SELECT img FROM Gallery WHERE id = ?";

  pool.query(selectSql, [id], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la photo",
      });
      return;
    }
    // Vérifier s'il y a un résultat
    if (results.length > 0) {
      let imageFilePath = `./public${results[0].img}`;
      fs.unlink(imageFilePath, function (error) {
        if (error) {
          console.log(error);
          res.status(500).send({
            error: "Erreur lors de la suppression de l'image",
          });
          return;
        }
        let deleteSql = "DELETE FROM Gallery WHERE id = ?";

        pool.query(deleteSql, [id], function (error, result, fields) {
          if (error) {
            console.log(error);
            res.status(500).send({
              error: "Erreur lors de la suppression de la marque",
            });
          } else {
            res.status(204).send();
          }
        });
      });
    } else {
      // Aucun résultat trouvé
      res.status(404).send({ error: "La marque n'a pas été trouvée" });
    }
  });
};

export const UpdateInfos = (req, res) => {
  const {updateTel , updateFacebookLink, updateInstragramLink} = req.body
  const sql = "UPDATE Info SET telephone = ?, fb_link = ?, insta_link = ?"
  const values = [updateTel , updateFacebookLink, updateInstragramLink]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }
    res.redirect("/admin");
  });
};
export const AddNewSchedule = (req, res) => {
  const {addDays , addHours, orderSchedule} = req.body
  const id = uuidv4();
  const sql = "INSERT INTO Schedule (id, day, hour, pos) VALUES (?, ?, ?, ?)"
  const values = [id, addDays , addHours, orderSchedule]
  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }
    res.redirect("/admin");
  });
};
export const DeleteSchedule = (req, res) => {
  let id = req.params.id;
  
  let deleteSql = "DELETE FROM Schedule WHERE id = ?";

  pool.query(deleteSql, [id], function (error, result, fields) {
    if (error) {
      console.log(error);
      res.status(500).send({
        error: "Erreur lors de la suppression de la catégorie",
      });
    } else {
      res.status(204).send();
    }
  });
};
