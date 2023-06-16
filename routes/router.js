import express from "express";

const router = express.Router();

//appel des controllers

import { IndexController } from "../controllers/index.js";
import { ServeController } from "../controllers/serve.js";
import { TeamController } from "../controllers/team.js";
import { GalerieController } from "../controllers/galerie.js";
import { ContactController } from "../controllers/contact.js";
import { LoginController, LoginSubmit, Logout } from "../controllers/login.js";
import { AdminController, NewAdmin, AddNewAdmin, DeleteAdmin,UpdateCarrouselPicture, UpdateIndexText, AddBrand, DeleteBrand, AddCategory, AddBenefit,
     DeleteCategory, DeleteBenefit, UpdateCategory, UpdateBenefit, AddPictureInGallery, DeletePictureInGallery, UpdateInfos, AddNewSchedule } from "../controllers/admin.js"

// Middleware qui bloque les routes si on est pas connecté
const adminCheckMiddleware = (roles) => (req, res, next) => {
    if (roles.includes(req.session.role)) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Affiche la page d'accueil
router.get('/', IndexController);

// Affiche la page des services et prix
router.get('/serve', ServeController);

// Affiche la page des services et prix
router.get('/team', TeamController);

// Affiche la page des services et prix
router.get('/galerie',  GalerieController);

// Affiche la page des services et prix
router.get('/contact', ContactController);

//affiche la formulaire de login
router.get('/login', LoginController);

//s'identifier a l'aide du  formulaire
router.post('/login', LoginSubmit);

//ce déconnecter
router.get('/logout', Logout);

//Affiche la page admin
// router.get('/admin', adminCheckMiddleware(['main', 'second']) ,AdminController)
router.get('/admin' ,AdminController);

//Affiche la page pour ajouter un nouvel admin
// router.get('/addnewadmin',adminCheckMiddleware(['main']),NewAdmin)
router.get('/addnewadmin',NewAdmin);

//Ajout d'un nouvel administrateur a l'aide du formulaire
router.post('/addnewadmin', AddNewAdmin);

//Suppression d'un admin secondaire
router.delete('/admin/:id', DeleteAdmin);

//Update des photos dans le carrousel via un formulaire
router.post('/addcarrouselpicture', UpdateCarrouselPicture);

//Update du text dans l'accueil
router.post('/updateindextext', UpdateIndexText);

//Ajout d'une marque dans la page d'accueil
router.post('/addbrand', AddBrand);

//Suppression d'une marque
router.delete('/brand/:id', DeleteBrand);

//Ajout d'une catégorie dans la page prestation
router.post('/addcategory', AddCategory);

//Ajout d'une prestation et d'un prix liés à une catégorie
router.post('/addbenefit', AddBenefit);

//Modification d'un catégorie dans la page prestation
router.post('/updatecategory', UpdateCategory);

// Modification d'une prestation
router.post('/updatebenefit', UpdateBenefit);

//Suppression d'une catégorie de prestation
router.delete('/category/:id', DeleteCategory);

//Suppression d'une prestation
router.delete('/benefit/:id', DeleteBenefit);

//Ajout d'une photo dans la galerie
router.post('/addpictureingallery', AddPictureInGallery);

//Suppression d'une photo dans la galerie
router.delete('/picture/:id', DeletePictureInGallery);

//Modification des informations diverses
router.post('/updateinfos', UpdateInfos)

//Ajout d'un nouvel horaire
router.post('/addnewschedule', AddNewSchedule)

export default router;