import bcrypt from 'bcrypt';
import authConfig from '../../../../config/auth';

export async function digest(plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, authConfig.saltRounds, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });
}

export async function compare(plainPassword, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hash, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}
