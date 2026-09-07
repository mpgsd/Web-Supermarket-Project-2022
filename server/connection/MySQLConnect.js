// establish Mysql Connection  
var mysql = require('mysql');  
  
pool = mysql.createPool({  
            connectionLimit: 10,  
            host     : 'localhost',  
            user     : 'client',  
            password : '12345Qwerty!@',  
            database : 'web_server'  
        });  
  
module.exports = pool