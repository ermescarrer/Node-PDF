"use strict"
var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
var fs = require('fs');
var Badge = require("./badge.js");
var Badge_logos = require("./badge_logos.js");
//var Mysqldaten        = require("./mysqldaten.js");
var mysql = require('mysql');
var connectionOption = {
    host: "10.0.0.18",
    user: "sefadmin",
    password: "MiniMac2013",
    database: "amadeus",
    multipleStatements: true
}
var con = mysql.createConnection(connectionOption);
// dei cardcode per esempio
var cardcode = '1011361,1075280';
var eventcode = 'ECS17';
var event_typ = eventcode.substr(0, 3);

var badge_logos = new Badge_logos(event_typ,eventcode);
var svg = badge_logos.get_current_event_logo();
var sql = badge_logos.get_SQL(cardcode,eventcode);

con.connect(function(err) {
    if (err) throw err;
    con.query(sql, function(err, result, fields) {
        if (err) throw err;
        var doc                     = new PDFDocument();
        var stream                  = doc.pipe(blobStream());
        var leftMargin              = 22;
        var topMargin               = 10;
        var badge                   = new Badge(leftMargin, topMargin, 257, 350, event_typ, connectionOption);
        badge.devider               = '|';
        badge.eventcode             = eventcode;
        badge.connectionOption      = connectionOption;
        
        for (var index = 0; index < result[0].length; index++) {
            badge.startY        = 80;
            var row = result[0][index];
            
            var BreakOutNr=1;
            badge.b1='';
            badge.b2='';
            for (var ii = 0; ii < result[1].length; ii++) {
                var row2 = result[1][ii];
                if(row.cardcode==row2.cardcode){
                    badge.setBreakOutCell(row2.kurz,BreakOutNr);
                    BreakOutNr++;
                    
                }
            }
            for (var iii = 0; iii < result[2].length; iii++) {
                var row3 = result[2][iii];
                if(row.klass==row3.klass){
                    badge.bezeichnung = row3.midle_txt;
                    badge.klassBezeichnungColor = row3.text_farbe;
                    badge.bottomcolor = row3.color;
                }
            }

            if(event_typ=='SIF'){
                badge.ICH_BIN_EIN='';
                for (var i4 = 0; i4 < result[3].length; i4++) {
                    var row4 = result[3][i4];
                    if(row.cardcode==row4.cardcode){
                        badge.ICH_BIN_EIN =row4.ICH_BIN_EIN;
                        badge.ICH_BIN_EIN_antwort =row4.singlequestion;
                    }
                }
            }else  if(event_typ=='ECS'){
                badge.t1='Y';
                badge.t2='X';
                badge.t3='A';
                badge.FirstCellDataBackgroundColor='#FFFFFF'
                for (var i4 = 0; i4 < result[3].length; i4++) {
                    var row4 = result[3][i4];
                   
                    if(row.cardcode==row4.cardcode){
                        badge.FirstCellDataBackgroundColor=row4.farbe;
                        console.log(row4.farbe);
                    }
                }
                
            }
           
           
            
            
            badge.setBadgeDaten(row);
            var CellWidth               = badge.SimpleCellWidth * 2;
            var cells                   = [];

            cells['FirstCells_Array']   = badge.set_FirstCellData(doc,CellWidth, cardcode);
            var brCellNr=2;
            brCellNr=(event_typ=='SIF')?1:brCellNr;
            cells['barcodeCells_Array'] = badge.set_CardcodeCellData(badge.SimpleCellWidth, cardcode,brCellNr);

            badge.build_mainframe(doc,svg,cells);
            badge.WriteBadgedata(doc);

            if (index < result[0].length - 1) {
                doc.addPage();
            }
            
        }
        doc.flushPages();
        var max=1000;
        var min=100;
        var random=Math.floor(Math.random() * (max - min)) + min;
        
        doc.pipe(fs.createWriteStream(__dirname+'/' + event_typ + '_' + random + '.pdf'));
        doc.pipe;
        doc.end();
        con.destroy();
        console.log('-- Alles Vertig ---');
    });
});