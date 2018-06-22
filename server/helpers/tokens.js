import JWT from 'jsonwebtoken';
import _ from 'lodash';
import { PUBLIC_ROUTES } from 'helpers/constants';

const tokenSecret = process.env.TOKEN_SECRET;

export function generateToken (payload, time) {
  return JWT.sign(payload, tokenSecret, {
    expiresIn : time,
  });
}

export function verifyToken (token, path) {
  return new Promise((resolve, reject) => {
    const ignoreExpiration = path === '/auth/refreshToken';
    JWT.verify(token, tokenSecret, { ignoreExpiration }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          valid   : true,
          content : decoded,
        });
      }
    });
  });
}

function isPublicRoute (routes, path) {
  return _.includes(routes, path);
}

function getParts (authorization) {
  const parts = authorization.split(' ');
  return {
    scheme : parts[0],
    token  : parts[1],
    size   : parts.length,
  };
}

export async function authMidleware (req, res, next) {
  try {
    console.log(req.path);
    const parts = req.headers.authorization ? getParts(req.headers.authorization) : null;
    const hasBearer = _.has(parts, 'scheme') ? /^Bearer$/i.test(parts.scheme) : null;
    if (!_.isNull(parts) && hasBearer) {
      const { content } = await verifyToken(parts.token, req.path);
      _.set(req, 'user', content);
      next();
    } else if (isPublicRoute(PUBLIC_ROUTES, req.path)) {
      next();
    } else {
      res.unauthorized(null, null, 'Unauthorized transaction *.*');
    }
  } catch (err) {
    res.unauthorized(err, null, 'Invalid request!');
  }
}
