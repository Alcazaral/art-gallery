import nodemailer from 'nodemailer';
import path from 'path';
import hostConfig from '../../../config/host';

const debug = require('debug')('app:modules:email');

const templates = require("dot").process({
  path: path.resolve(__dirname, 'templates'),
});

const transporter = nodemailer.createTransport({
  transport: 'ses', // loads nodemailer-ses-transport
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const siteData = {
  siteUrl: hostConfig.hostUrl,
  logoUrl: `${hostConfig.hostUrl}/public/logo/logo-color.png`,
  userImageUrl: `${hostConfig.hostUrl}/public/user/unnamed.gif`,
  logoCircleUrl: `${hostConfig.hostUrl}/public/logo/logo-circle.png`,
  ceoImageUrl: `${hostConfig.hostUrl}/public/ceo.jpg`,
};

export function signup(email, validationToken) {
  const templateData = {
    email,
    confirmEmailUrl: `${hostConfig.hostUrl}/signup/confirm/${
      email}/${validationToken}`,
    ...siteData,
  };

  debug('Rendering email with data', templateData);

  const mailData = {
    from: `"Ruby Lens" <${hostConfig.email}>`,
    to: email,
    subject: 'The fog of war is starting to clear…',
    html: templates.signup(templateData),
  };

  // Returns a promise
  return transporter.sendMail(mailData);
}

export function resetPassword(email, token) {
  const templateData = {
    email,
    token,
    resetPasswordUrl: `${hostConfig.hostUrl}/password-resets/edit/${
      email}/${token}`,
    ...siteData,
  };

  debug('Rendering email with data', templateData);

  const mailData = {
    from: `"Ruby Lens" <${hostConfig.email}>`,
    to: email,
    subject: 'Ruby Lens Password reset instructions',
    html: templates.resetPassword(templateData),
  };

  // Returns a promise
  return transporter.sendMail(mailData);
}
