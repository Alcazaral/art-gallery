Important types of Errors

1) Validation Errors
Errors that do not pass trough the schema definition of a route
We use Joi validator
These errors could be printed nicely because we are already expecting them
But they should not happen since the stuff needs to be validated in the front end

status code = 400
format:
{
  errorPath: {
    message: 'Some error message',
    type: 'some error type',
    context: {
      key: 'some context'
    }
  },
  username : {
  	"message": "\"username\" is required",
  	"path": "username",
  	"type": "any.required",
  	"context": {
  		"key": "username"
  	}
  }
}


2) Conflict route Errors
Errors that happens processing user data, like an username taken
These errors could be printed nicely because we are already expecting them
We could return this in map

status code = 500

body format:
{
  errors: ['error_getting_oauth_profile']
}

status code = 409

format: {
  errorPath: {
    message: 'Some nice error message'
  },
  username: {
    message: 'This user is already registered'
  }
}

3) Bubbled Errors
Errors that we do not expect and we do not have a nice way to render them

status code = 500

body format:
'Custom error String ' || 'INTERNAL_ERROR'
