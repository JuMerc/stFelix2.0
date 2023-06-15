import express from "express";

const router = express.Router();

//appel des controllers

import { IndexController } from "../controllers/index.js";
import { ServeController } from "../controllers/serve.js";
import { TeamController } from "../controllers/team.js";
import GalerieController from "../controllers/galerie.js";
import ContactController from "../controllers/contact.js";
import { LoginController, LoginSubmit, Logout } from "../controllers/login.js";
import { AdminController, NewAdmin, AddNewAdmin, UpdateCarrouselPicture, UpdateIndexText, AddBrand, DeleteBrand, AddCategory, AddBenefit, DeleteCategory, DeleteBenefit } from "../controllers/admin.js"

// Middleware qui bloque les routes si on est pas connecté
const adminCheckMiddleware = function (req, res, next) {
    if(req.session.isAdmin) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Affiche la page d'accueil
router.get('/', IndexController);

// Affiche la page des services et prix
router.get('/serve', ServeController)

// Affiche la page des services et prix
router.get('/team', TeamController)

// Affiche la page des services et prix
router.get('/galerie', GalerieController)

// Affiche la page des services et prix
router.get('/contact', ContactController)

//affiche la formulaire de login
router.get('/login', LoginController)

//s'identifier a l'aide du  formulaire
router.post('/login', LoginSubmit)

//ce déconnecter
router.get('/logout', Logout);

//Affiche la page admin
// router.get('/admin', adminCheckMiddleware ,AdminController)
router.get('/admin' ,AdminController)

//Affiche la page pour ajouter un nouvel admin
router.get('/addnewadmin',adminCheckMiddleware,NewAdmin)

//Ajout d'un nouvel administrateur a l'aide du formulaire
router.post('/addnewadmin', AddNewAdmin)

//Update des photos dans le carrousel via un formulaire
router.post('/addcarrouselpicture', UpdateCarrouselPicture)

//Update du text dans l'accueil
router.post('/updateindextext', UpdateIndexText )

//Ajout d'une marque dans la page d'accueil
router.post('/addbrand', AddBrand)

//Suppression d'une marque
router.delete('/brand/:id', DeleteBrand);

//Ajout d'une catégorie dans la page prestation
router.post('/addcategory', AddCategory)

//Ajout d'une prestation et d'un prix liés à une catégorie
router.post('/addbenefit', AddBenefit)

//Suppression d'une catégorie de prestation
router.delete('/category/:id', DeleteCategory);

//Suppression d'une prestation
router.delete('/benefit/:id', DeleteBenefit);

export default router;