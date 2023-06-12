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

// export const AddCarrouselPicture = (req, res) => {
//   const maxSize = 5 * 1024 * 1024;
//   const form = new formidable.IncomingForm();
//   const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
//     }
//     const extension = [
//        files.carrousel1.originalFilename.split(".").pop(),
//        files.carrousel2.originalFilename.split(".").pop(),
//        files.carrousel3.originalFilename.split(".").pop(),
//        files.carrousel4.originalFilename.split(".").pop(),
//        files.carrousel5.originalFilename.split(".").pop()
//     ]
//     const oldPath = [
//       files.carrousel1.filepath,
//       files.carrousel2.filepath,
//       files.carrousel3.filepath,
//       files.carrousel4.filepath,
//       files.carrousel5.filepath
//     ]
//     const newPath = [
//        `./public/carrousel/${files.carrousel1.newFilename}.${extension}`,
//        `./public/carrousel/${files.carrousel2.newFilename}.${extension}`,
//        `./public/carrousel/${files.carrousel3.newFilename}.${extension}`,
//        `./public/carrousel/${files.carrousel4.newFilename}.${extension}`,
//        `./public/carrousel/${files.carrousel5.newFilename}.${extension}`
//     ]
//     const sizeTab = [
//       files.carrousel1.size,
//       files.carrousel2.size,
//       files.carrousel3.size,
//       files.carrousel4.size,
//       files.carrousel5.size
//     ]

//     const authorizedExtentionTab = [
//       authorizedExtention.includes(files.carrousel1.mimetype),
//       authorizedExtention.includes(files.carrousel2.mimetype),
//       authorizedExtention.includes(files.carrousel3.mimetype),
//       authorizedExtention.includes(files.carrousel4.mimetype),
//       authorizedExtention.includes(files.carrousel5.mimetype)
//     ]
//     for(let i=1; i<=5; i++){
//       if (sizeTab[i] > maxSize) {
//         return res.status(500).send(`Image${[i]} trop volumineuse`);
//       }
//       if (authorizedExtentionTab[i]) {
//         return res.status(500).send("Le fichier n'a pas la bonne extention");
//       }
//       fs.rename(oldPath[i], newPath[i], (error) => {
//         if (error) {
//           console.log(error);
//         }
//       });
//     }
    
//     const carrousel = [
//       `/carrousel/${files.carrousel1.newFilename}.${extension.carrousel1}`,
//       `/carrousel/${files.carrousel2.newFilename}.${extension.carrousel2}`,
//       `/carrousel/${files.carrousel3.newFilename}.${extension.carrousel3}`,
//       `/carrousel/${files.carrousel4.newFilename}.${extension.carrousel4}`,
//       `/carrousel/${files.carrousel5.newFilename}.${extension.carrousel5}`
//     ]
//     for(let i = 1; i<=5; i++){
//       pool.query(
//         "INSERT INTO carrousel (id, img) VALUES (?, ?)",
//         [uuidv4(), carrousel.img[i] ],
//         function (error, result, fields) {
//           console.log(error);
          
//         }
//       );
//     }
//     res.redirect("/");
//   });
// };
export const AddCarrouselPicture = (req, res) => {
const maxSize = 5 * 1024 * 1024;
const form = new formidable.IncomingForm();
const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];

form.parse(req, (err, fields, files) => {
  if (err) {
    console.error(err);
    return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
  }
  const extension = files.carrousel1.originalFilename.split(".").pop();
  const oldPath = files.carrousel1.filepath;
  const newPath = `./public/carrousel/${files.carrousel1.newFilename}.${extension}`;

  if (files.carrousel1.size > maxSize) {
    return res.status(500).send("Image trop volumineuse");
  }
  if (!authorizedExtention.includes(files.carrousel1.mimetype)) {
    return res.status(500).send("Le fichier n'a pas la bonne extention");
  }

  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error);
    }
  });

const img = `/carrousel/${files.carrousel1.newFilename}.${extension}`;

  pool.query(
    "INSERT INTO carrousel (id, img) VALUES (?, ?)",
    [uuidv4(), img ],
    function (error, result, fields) {
      console.log(error);
      // res.redirect("/");
    }
  );
});
form.parse(req, (err, fields, files) => {
  console.log(fields);

  if (err) {
    console.error(err);
    return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
  }
  const extension = files.carrousel2.originalFilename.split(".").pop();
  const oldPath = files.carrousel2.filepath;
  const newPath = `./public/carrousel/${files.carrousel2.newFilename}.${extension}`;

  if (files.carrousel2.size > maxSize) {
    return res.status(500).send("Image trop volumineuse");
  }
  if (!authorizedExtention.includes(files.carrousel2.mimetype)) {
    return res.status(500).send("Le fichier n'a pas la bonne extention");
  }

  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error);
    }
  });

const img = `/carrousel/${files.carrousel2.newFilename}.${extension}`;

pool.query(
  "INSERT INTO carrousel (id, img) VALUES (?, ?)",
  [uuidv4(), img ],
  function (error, result, fields) {
    console.log(error);
    res.redirect("/");
  }
);
});
form.parse(req, (err, fields, files) => {
  console.log(fields);

  if (err) {
    console.error(err);
    return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
  }
  const extension = files.carrousel3.originalFilename.split(".").pop();
  const oldPath = files.carrousel3.filepath;
  const newPath = `./public/carrousel/${files.carrousel3.newFilename}.${extension}`;

  if (files.carrousel2.size > maxSize) {
    return res.status(500).send("Image trop volumineuse");
  }
  if (!authorizedExtention.includes(files.carrousel3.mimetype)) {
    return res.status(500).send("Le fichier n'a pas la bonne extention");
  }

  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error);
    }
  });

const img = `/carrousel/${files.carrousel3.newFilename}.${extension}`;

  pool.query(
    "INSERT INTO carrousel (id, img) VALUES (?, ?)",
    [uuidv4(), img ],
    function (error, result, fields) {
      console.log(error);
      res.redirect("/");
    }
  );
});
form.parse(req, (err, fields, files) => {
  console.log(fields);

  if (err) {
    console.error(err);
    return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
  }
  const extension = files.carrousel4.originalFilename.split(".").pop();
  const oldPath = files.carrousel4.filepath;
  const newPath = `./public/carrousel/${files.carrousel4.newFilename}.${extension}`;

  if (files.carrousel4.size > maxSize) {
    return res.status(500).send("Image trop volumineuse");
  }
  if (!authorizedExtention.includes(files.carrousel4.mimetype)) {
    return res.status(500).send("Le fichier n'a pas la bonne extention");
  }

  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error);
    }
  });

const img = `/carrousel/${files.carrousel4.newFilename}.${extension}`;

  pool.query(
    "INSERT INTO carrousel (id, img) VALUES (?, ?)",
    [uuidv4(), img ],
    function (error, result, fields) {
      console.log(error);
      res.redirect("/");
    }
  );
});
form.parse(req, (err, fields, files) => {
  console.log(fields);

  if (err) {
    console.error(err);
    return res.status(500).send("Une erreur est survenue lors de l'upload de l'image.");
  }
  const extension = files.carrousel5.originalFilename.split(".").pop();
  const oldPath = files.carrousel5.filepath;
  const newPath = `./public/carrousel/${files.carrousel5.newFilename}.${extension}`;

  if (files.carrousel5.size > maxSize) {
    return res.status(500).send("Image trop volumineuse");
  }
  if (!authorizedExtention.includes(files.carrousel5.mimetype)) {
    return res.status(500).send("Le fichier n'a pas la bonne extention");
  }

  fs.rename(oldPath, newPath, (error) => {
    if (error) {
      console.log(error);
    }
  });

const img = `/carrousel/${files.carrousel5.newFilename}.${extension}`;

  pool.query(
    "INSERT INTO carrousel (id, img) VALUES (?, ?)",
    [uuidv4(), img ],
    function (error, result, fields) {
      console.log(error);
      res.redirect("/");
    }
  );
});

};
