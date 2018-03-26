//  This is a Constructor function taking age and passport 
//  as the paramaters

// Let change Again
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "10.0.0.18",
    user: "sefadmin",
    password: "MiniMac2013",
    database: "amadeus"
  });
function Dbmanager() {
    //this.leftMargin             = leftMargin;
    this.nachname='-- Nachname --';
}
Dbmanager.prototype.OnDataFetch = function(nachname) {
    this.nachname=nachname;
}


Dbmanager.prototype.getKundenData = function(cardcode) {
   con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT cardcode,nachname,vorname,firma,funktion FROM clients where cardcode="+cardcode, function (err, result, fields) {
          if (err) throw err;
          
          

          
          for (var index = 0; index < result.length; index++) {
              var element = result[index];
            
              this.nachname=element.nachname;
              this.vorname=element.vorname;
              this.firma=element.firma;
              this.funktion=element.funktion;
              console.log(this.nachname);
              console.log(this.vorname);
              console.log(this.firma);
              console.log(this.funktion);
              
              
          }
        });
      });

var query = con.query("SELECT cardcode,nachname,vorname,firma,funktion FROM clients where cardcode in (1041361,1041362)");

// query.on('error', function(err) {
//    throw err;
// });

// query.on('fields', function(fields) {
//    //console.log(fields);
// });

// query.on('result', function(row) {
//     this.nachname=row.nachname;
   
// });

return query;
};

Dbmanager.prototype.DestroyCon = function() {
     
 };

 Dbmanager.getNachname = function(klass) {
   return this.nachname;
};
module.exports = Dbmanager;