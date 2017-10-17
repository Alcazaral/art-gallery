// NOTE: pg pool does not trigger an error when initializing the database and
// the database server is not reachable
// it triggers the error until you try to make a request

const options = {

  // pg-promise initialization options...

  // looks like it logs every error
  error: function onDbError(err, e) {
    console.error('DB client error: ', err.message);

    // e.dc = Database Context

    if (e.cn) {
        // this is a connection-related error
        // cn = safe connection details passed into the library:
        //      if password is present, it is masked by #
    }

    if (e.query) {
        // query string is available
        if (e.params) {
            // query parameters are available
        }
    }

    if (e.ctx) {
        // occurred inside a task or transaction
    }
  },
};

const pgp = require('pg-promise')(options);

// Database connection details;
const connectionDetails = {
  host: 'database', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'rubylens',
  user: 'rubylens',
  password: 'changethis',
};

const db = pgp(connectionDetails);

export default db;
