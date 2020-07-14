import expressJwt from 'express-jwt';
import conf from '../conf/conf';

const DEVELOPER_MODE = conf.developerMode === true;

const PATHS_WITH_OPEN_ACCESS = [
    '/auth/login',
    '/auth/register'
];

const applyMiddleware = app => {
	if (DEVELOPER_MODE === false) {
		app.use(
			expressJwt({
                secret: conf.jwtSecretKey,
                algorithms: ['HS256']
            }).unless({ path: PATHS_WITH_OPEN_ACCESS })
		);
	}
};

export default {
	applyMiddleware
};
