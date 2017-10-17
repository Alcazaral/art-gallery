
export default function(Validator) {
  Validator.addMethod('isValidUsername', function(tip) {

    tip = tip || 'Invalid username';

    this
      .isString(tip)
      .isLength(2, 30, tip)
      .match(/^[a-z0-9_-]+$/i, tip)
      // .notEq('__proto__', tip); // TODO: enable this validation

    return this;
  });
  Validator.addMethod('isBoolean', function(tip) {

    tip = tip || 'Invalid boolean value';

    this
      .isIn([true, false])

    return this;
  });
}