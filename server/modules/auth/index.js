import Router from 'koa-router';
import loginEmail from './endpoint/login/email';
import loginEmailSchema from './endpoint/login/emailSchema';
import loginOauth from './endpoint/login/oauth';
import loginOauthSchema from './endpoint/login/oauthSchema';
import logout from './endpoint/logout/logout';
import passwordResetsEditPassword from './endpoint/passwordResets/editPassword';
import passwordResetsNewPassword from './endpoint/passwordResets/newPassword';
import passwordResetsNewPasswordSchema from
  './endpoint/passwordResets/newPasswordSchema';
import PasswordResetsRenderSetNewPasswordPage from
  './endpoint/passwordResets/renderSetNewPasswordPage';
import signupRegisterEmailSchema from './endpoint/signup/registerEmailSchema';
import signupConfirmEmailToken from './endpoint/signup/confirmEmailToken';
import signupConfirmEmailTokenSchema from
  './endpoint/signup/confirmEmailTokenSchema';
import signupSetupAccount from './endpoint/signup/setupAccount';
import signupSetupAccountSchema from './endpoint/signup/setupAccountSchema';
import signupOauthCallback from './endpoint/signup/oauthCallback';
import signupRegisterEmail from './endpoint/signup/registerEmail';
import signupRegisterOauth from './endpoint/signup/registerOauth';
import signupRegisterOauthSchema from './endpoint/signup/registerOauthSchema';
import signupTwitterToken from './endpoint/signup/twitterToken';
import { renderPage } from '../util';

const router = new Router();

router

  /** ===== Signup ===== **/

  // Render signup Page
  .get('/signup/', renderPage('gallery', 'signup'))

  // Render confirm email page
  .get('/signup/confirm-email', renderPage('signup/confirm-email'))

  // Get token from email and validate account
  .get('/signup/confirm/:email/:validationToken',
    signupConfirmEmailTokenSchema, signupConfirmEmailToken)

  // Oauth callback for Oauth providers
  .get('/signup/:provider/callback', signupOauthCallback)

  // Provide twitter token for client
  .get('/signup/twitter-token', signupTwitterToken)

  // Receive email and create user
  .post('/api/auth/signup/email',
    signupRegisterEmailSchema, signupRegisterEmail)

  // Receive Oauth Code and create user
  .post('/api/auth/signup/oauth',
    signupRegisterOauthSchema, signupRegisterOauth)

  // Render signup unverified email page
  .get('/signup/unverified', renderPage('signup/unverified'))

  // Render setup-account page
  .get('/signup/setup-account', renderPage('signup/setup-account'))

  // Set up basic user information
  .post('/api/auth/signup/setup-account',
    signupSetupAccountSchema, signupSetupAccount)


  /** ===== Logout ===== **/

  .post('/api/auth/signout', logout)


  /** ===== Login ===== **/

  // Render login page
  .get('/login', renderPage('gallery', 'login'))

  // Login by email
  .post('/api/auth/login/oauth',
    loginOauthSchema, loginOauth)

  // Login by Oauth
  .post('/api/auth/login/email',
    loginEmailSchema, loginEmail)


  /** ===== Password reset ===== **/

  // Render password resets page
  .get('/password-resets/new', renderPage('password-resets/new'))

  // Send reset password email
  .post('/api/auth/password-resets/new',
    passwordResetsNewPasswordSchema, passwordResetsNewPassword)

  // Render password reset sent page
  .get('/password-resets/sent', renderPage('password-resets/sent'))

  // Receive the token for password reset
  .get('/password-resets/edit/:email/:token',
  PasswordResetsRenderSetNewPasswordPage)

  // Create a new password
  .post('/api/auth/password-resets/edit', passwordResetsEditPassword);

export default router;
