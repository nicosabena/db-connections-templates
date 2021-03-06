function create (user, callback) {
  //this example uses the "tedious" library
  //more info here: http://pekim.github.io/tedious/index.html
  const bcrypt = require('bcrypt');
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName:  'test',
    password:  'test',
    server:    'localhost',
    options:  {
      database: 'mydb'
    }
  });

  const query = 'INSERT INTO dbo.Users SET Email = @Email, Password = @Password';

  connection.on('debug', function(text) {
    console.log(text);
  }).on('errorMessage', function(text) {
    console.log(JSON.stringify(text, null, 2));
  }).on('infoMessage', function(text) {
    console.log(JSON.stringify(text, null, 2));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    const request = new Request(query, function (err, rows) {
      if (err) return callback(err);
      console.log('rows: ' + rows);
      callback(null);
    });

    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) return callback(err);
      request.addParameter('Email', TYPES.VarChar, user.email);
      request.addParameter('Password', TYPES.VarChar, hash);
      connection.execSql(request);
    });
  });
}
