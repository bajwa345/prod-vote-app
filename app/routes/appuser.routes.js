module.exports = app => {
	const appusers = require("../controllers/appuser.controller.js");
    const checkAuth = require('../middleware/check-auth');
	var router = require("express").Router();

	router.put("/list-appusers", checkAuth, appusers.listAppUsers);
	router.post("/new-appuser", checkAuth, appusers.newAppUser);
	router.post("/update-appuser", checkAuth, appusers.updateAppUser);
	router.post("/reset-appuser-password", checkAuth, appusers.resetAppUserPassword);
	router.post("/register-user", checkAuth, appusers.registerUser);
	router.post("/delete-appuser", checkAuth, appusers.deleteAppUser);
	router.post("/delete-all-appuser", checkAuth, appusers.deleteAllAppUser);

	app.use('/api/appusers', router);
};
