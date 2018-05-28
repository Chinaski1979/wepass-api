import JWT from 'jsonwebtoken';
const tokenSecret = process.env.TOKEN_SECRET;

export function generateToken (payload, time) {
  return JWT.sign(payload, tokenSecret, {
    expiresIn : time,
  });
}

export function getParts (authorization) {
  return new Promise((resolve) => {
    const parts = authorization.split(' ');
    resolve({
      scheme : parts[0],
      token  : parts[1],
      size   : parts.length,
    });
  });
}

export function verifyToken (token, ignoreTime) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, tokenSecret, { ignoreExpiration : ignoreTime }, (err, decoded) => {
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
