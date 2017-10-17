import jwt from 'jsonwebtoken';
import authConfig from '../../../../config/auth';

export function sign(payload) {
  return jwt.sign(payload, authConfig.jwtSecret);
}

export function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, authConfig.jwtSecret, (err, decoded) => {
      return err ? reject(err) : resolve(decoded);
    });
  });
}
