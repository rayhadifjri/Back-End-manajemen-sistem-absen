const express = require('express');
const router = express.Router();
const { userController } = require('../controller');
const { Auth } = require('../middleware');
const { refresh } = require('../controller');
const { AuthAdmin } = require('../middleware');
const { AuthWhoAmI } = require('../middleware');

router.route('/login').post(userController.login);
router.route('/register').post(Auth.verifyToken, userController.register);
router.route('/getUsers').get(Auth.verifyToken, userController.getUsers);
router.route('/getUserbyId/:id_user').get(Auth.verifyToken, userController.getUserbyId);
router.route('/editUser/:id_user').patch(Auth.verifyToken, userController.editUser);
router.route('/getUsersbyPartialUsername/:partialUsername').get(Auth.verifyToken, userController.getUsersByPartialUsername);
router.route('/refreshToken').get(refresh.refreshToken);
router.route('/logout').delete(userController.logout);
router.route('/deleteUser/:id_user').delete(Auth.verifyToken, userController.deleteUser);
router.route('/me').get(Auth.verifyToken, AuthWhoAmI.whoami)

module.exports = router;