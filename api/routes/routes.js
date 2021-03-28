module.exports = async (app, router, logger, config, mongoose) => {

    const jwt = require('jsonwebtoken');
    const crypto = require('crypto');

    const routes = config.settings.routes;
    const authentication = require('../utilities/Authentication')(jwt, config, logger);
    const process = await require('../utilities/Process')(mongoose, config, jwt, logger, crypto, authentication);

    router.get('/', function (req, res, next) {
        res.send('Express server listening....');
    });

    router.post(routes.signIn, process.signIn);

    // user curd
    router.get(routes.users, authentication.verifyToken, process.userList);
    router.get(routes.user, authentication.verifyToken, process.userDetail);
    router.delete(routes.user, authentication.verifyToken, process.deleteUser);
    // router.post(routes.createUser, authentication.verifyToken, process.createUser);
    router.post(routes.createUser, process.createUser);
}
