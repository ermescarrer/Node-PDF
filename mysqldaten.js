    "use strict"
    var mysql           = require('mysql');

    function Mysqldaten(connectionOption) {
        this.connectionOption=connectionOption;
    }

    Mysqldaten.prototype.getKundendata = function(sql, callback) {
    var con = mysql.createConnection(this.connectionOption);
    var query = con.query(sql);
        query.on('result', function(row) {
            callback(null, row);
        });
        con.end(); 
        /**
            var mysqldaten = new Mysqldaten(connectionOption);
             mysqldaten.getKundendata(sql,function(err,result){
            //console.log(result);
            }); 
         */
  
    };

    Mysqldaten.prototype.getKundenRecordset = function(sql, callback) {
        var con = mysql.createConnection(this.connectionOption);
        con.query(sql,function(err,rows, fields) {
            if (!err){
                callback(null, rows, fields);
            }
            else{
                console.log('Error while performing Query.');
            }
          });
          con.end();
     /**
            var mysqldaten = new Mysqldaten(connectionOption);
            mysqldaten.getKundenRecordset(sql,function(err,rows,fields){
            //console.log(rows);
            }); 
         */     
    };



module.exports = Mysqldaten;

