module.exports = async (mongoose, config, jwt, logger, crypto, authentication) => {

    const configSettings = config.settings;

    // Models
    const UserModel = require('../models/UserModel');
    const TaskModel = require('../models/TaskModel');

    //services
    const userService = require('../services/UserService')(UserModel, TaskModel, mongoose);
    const commonService = require('../services/CommonService')(configSettings);

    // Controllers
    const userController = require('../controllers/UserController')(configSettings, userService, logger, commonService);
    const loginController = require('../controllers/LoginController')(configSettings, userService, logger, commonService, authentication, crypto);

    return {
        signIn: (req, res) => {
            loginController.signIn(req, res);
        },
        userList: (req, res) => {
            userController.getUserList(req, res);
        },
        userDetail: (req, res) => {
            userController.getUserDetail(req, res);
        },
        deleteUser: (req, res) => {
            userController.deleteUser(req, res);
        },
        createUser: (req, res) => {
            userController.createUser(req, res);
        }
    }
}
