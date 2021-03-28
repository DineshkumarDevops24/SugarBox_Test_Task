module.exports = (config, userService, logger, CommonService) => {

    return {
        getUserList: (req, res) => {
            let params = req.query;
            let condition = {};
            params.limit = params.limit ? Number(params.limit) : 10;
            params.page = params.page ? Number(params.page) : 0;
            const data = {
                query: condition,
                skip: params.page * params.limit,
                limit: params.limit
            };
            userService.getUsers(data, function (err, users) {
                if (err) {
                    logger.error(err.stack);
                    return res.json(CommonService.getErrorResponse(err.stack));
                } else {
                    return res.json(CommonService.getSuccessResponse(config.success.messages.userList, users));
                }
            });
        },
        getUserDetail: (req, res) => {
            userService.findUser(req.params.id, function (err, user) {
                if (err) {
                    logger.error(err.stack);
                    return res.json(CommonService.getErrorResponse(err.stack));
                } else {
                    return res.json(CommonService.getSuccessResponse(config.success.messages.userDetail, user));
                }
            });
        },
        deleteUser: (req, res) => {
            if (req.params.id) {
                userService.deleteUser({_id: req.params.id}, function (err, deleteRes) {
                    if (err) {
                        logger.error(serverErrorCode, databaseError, err.stack);
                        return res.json(CommonService.getErrorResponse(err.stack));
                    }
                    return res.json(CommonService.getSuccessResponse(config.success.messages.deleteUser, deleteRes));
                });
            } else {
                return config.errors.badRequest.userIdMissing;
            }
        },
        createUser: (req, res) => {
            if (req.body && req.body.email) {
                userService.createUser(req.body, function (err, user) {
                    if (err) {
                        logger.error(err.stack);
                        return res.json(CommonService.getErrorResponse(err.stack));
                    }
                    if (typeof user === 'string') return res.json(CommonService.getSuccessResponse(user, null));
                    return res.json(CommonService.getSuccessResponse(config.success.messages.createUser, user));
                });
            } else {
                res.json(config.errors.badRequest.requiredFieldsMissing);
            }
        }
    };
}

