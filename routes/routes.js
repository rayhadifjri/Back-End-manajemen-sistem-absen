const express = require('express');
const router = express.Router();
const { userController } = require('../controller');
const { Auth } = require('../middleware');
const { refresh } = require('../controller');
const { AuthAdmin } = require('../middleware');
const { AuthWhoAmI } = require('../middleware');
const { Multer } = require('../middleware');

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
router.route('/getApprovedIjinSakit/:id_ijinkhusus').get(userController.getApprovedIjinSakit)
router.route('/sicknessPermit/:id_user').post(Multer.uploadSickness, userController.ijinSakit)
router.route('/externalApplication/:id_user').post(Multer.uploadExternal, userController.dinasLuar)
router.route('/leaveApplication/:id_user').post(Multer.uploadLeave, userController.pengajuanCuti)
router.route('/getijinbyidketijin/:id_ketijin').get(userController.getijinbyidketijin)
router.route('/deleteijin/:id_ijinkhusus').patch(userController.deleteijin)
router.route('/approvedIjinSakit/:id_ijinkhusus').patch(userController.approvedIjinSakit)
router.route('/getProdi').get(userController.getProdi)
router.route('/getFakultas').get(userController.getFakultas)
router.route('/getKetangkatan').get(userController.getKetangkatan)
router.route('/getUserbyProdiandAngkatan').get(userController.getAngkatan)
router.route('/pengajuanIzin/:id_user').get(userController.pengajuanIzin)
router.route('/listPengajuanIzin').get(userController.listPengajuanIzin)
router.route('/ketijin').get(userController.ketijin)
router.route('/getLevel').get(userController.getLevel)
router.route('/forget-password').post(userController.forgetPassword)
router.route('/hapusPengajuanIzin/:id_ijinkhusus').delete(userController.hapusPengajuanIzin)
router.route('/reset-password/:id_user/:token').post(userController.resetPassword)

router.route('/getMasterStatusIjin/:id_level').get(userController.getMasterStatusIjin)
router.route('/updateIjin').post(userController.updateIjin)

module.exports = router;