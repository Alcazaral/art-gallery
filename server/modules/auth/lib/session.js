import { sign as signToken } from './token';

/** Web tokens used for users sessions **/
export function createSessionToken(userId, role, registerStep) {
  return signToken({ userId, role, registerStep });
}

/** Web tokens used for register process **/
export function createRegisterToken(
  userId,
  role,
  registerMode,
  registerStep) {
  const obj = {
    userId,
    role,
    registerMode,
    registerStep,
  };

  return signToken(obj);
}
