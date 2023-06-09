import express from "express";

const router = express.Router();

//appel des controllers

import IndexController from "../controllers/index.js";
import ServeController from "../controllers/serve.js";
import TeamController from "../controllers/team.js";
import GalerieController from "../controllers/galerie.js";
import ContactController from "../controllers/contact.js";
import { LoginController, LoginSubmit, Logout } from "../controllers/login.js";
import { AdminController, NewAdmin, AddNewAdmin } from "../controllers/admin.js"

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

router.get('/admin', adminCheckMiddleware ,AdminController)

//Affiche la page pour ajouter un nouvel admin

router.get('/addnewadmin',adminCheckMiddleware,NewAdmin)

//Ajout d'un nouvel administrateur a l'aide du formulaire

router.post('/addnewadmin', AddNewAdmin)


export default router;