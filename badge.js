//  This is a Constructor function taking age and passport 
//  as the paramaters

var SVGtoPDF          = require('SVG-to-PDFKit');
var mysql             = require('mysql');
var Mysqldaten        = require("./mysqldaten.js");
var brkoutSessionKurz=[];
function Badge(leftMargin, topMargin, badgeWidth, badgeHeight,event_typ,connectionOption) {
    this.leftMargin             = leftMargin;
    this.topMargin              = topMargin;
    this.badgeWidth             = badgeWidth;
    this.badgeHeight            = badgeHeight;
    this.SimpleCellWidth        = parseInt(badgeWidth / 6);

    this.bottomcolor = 'white';
    this.KlassBezeichnungColor = 'black';
    this.badgedata = [];
    this.funktionDevider = '|';
    this.firmaDevider = '|';
    this.cardcode = 0;

    this.startY = 90;
    this.firma_funktion_abstand = 28;
    this.firma_funktion_fontSize = 22;
    this.hat_splitted = false;
    this.event_typ  =   event_typ;
    this.fonts_path = 'fonts/coolvetica rg.ttf';
    this.cell_nr_neben_barcode = 2;
    this.connectionOption             =connectionOption ;
}

// Badge.prototype.getBadgedata = function() {
//     return this.badgedata
// };

Badge.prototype.setCardcode = function(cardcode) {
    this.cardcode = cardcode;
};

Badge.prototype.setClientname = function(vorname, nachname) {
    this.vorname = vorname.trim();
    this.nachname = nachname.trim();
    this.badgedata = [];
var lastAbstand=20;
    if ((this.vorname.length + this.nachname.length) > 20) {

        this.badgedata.push({
            'value': this.vorname,
            'abstand': 28,
            'fontSize': '23'
        });
        this.badgedata.push({
            'value': this.nachname,
            'abstand': 28,
            'fontSize': '23'
        });
        lastAbstand=5;
    } else {
        this.badgedata.push({
            'value': this.vorname + ' ' + this.nachname,
            'abstand': 25,
            'fontSize': '25'
        });
    }

    this.badgedata.push({
        'value': ' ',
        'abstand': lastAbstand,
        'fontSize': 1
    });
};

Badge.prototype.setFirma = function(firma, devider) {
    this.firma = firma.trim();
    this.firmaDevider = devider;

    if (this.firma.split(devider).length > 0) {
        this.setFirmaFunktionParam();
    }
};

Badge.prototype.setFunktion = function(funktion, devider) {
    this.funktion = funktion.trim();
    this.funktionDevider = devider;
    if (this.funktion.split(devider).length > 0) {
        this.setFirmaFunktionParam();
    }
};

Badge.prototype.setFirmaFunktionParam = function(f) {
    this.firma_funktion_abstand = 20;

};

Badge.prototype.SplitInArray = function(str, devider) {
    var temp_array = str.split(devider);
    if (temp_array === 1) {
        this.badgedata.push({
            'value': str.trim(),
            'abstand': this.firma_funktion_abstand,
            'fontSize': this.firma_funktion_fontSize
        });
    } else {
        temp_array.forEach(function(element) {
            this.badgedata.push({
                'value': element.trim(),
                'abstand': this.firma_funktion_abstand,
                'fontSize': (this.firma_funktion_fontSize-4)
            });
        }, this);
    }
};

Badge.prototype.setBadgeDaten = function(row) {
    this.klass      = row.klass;
    this.sprache    = row.sprache;
    this.setClientname(row.vorname,row.nachname);
    this.setFirma(row.firma, this.devider);
    this.setFunktion(row.funktion, this.devider);
    this.setCardcode(row.cardcode);


};

Badge.prototype.setBreakOutCell = function(bezeichnung,nr) {
    if(nr==1){
        this.b1=bezeichnung;
    }else if(nr==2){
        this.b2=bezeichnung;
    }
};

Badge.prototype.WriteBadgedata = function(doc) {
    for (var i in this.badgedata) {
        var wert = this.badgedata[i]['value'];
        wert = wert.trim();
        if (wert === 'LINEA_HORIZONTAL') {
            doc.lineCap("butt")
                .moveTo(this.leftMargin, (this.startY + 5))
                .lineWidth(1)
                .strokeColor('silver')
                .lineTo((this.badgeWidth + this.leftMargin), (this.startY + 5))
                .stroke();

        } else {
            

            doc.font(this.fonts_path).fontSize(this.badgedata[i]['fontSize']).fillColor('black').text(wert, this.leftMargin, this.startY, {
                width: this.badgeWidth,
                align: 'center',
                columns: 1
            });

        }
        this.startY = this.startY + this.badgedata[i]['abstand'];
    };
}

/**
 * Function place_horizontalCell
 * doc
 * CellsTop Y value
 * CellWidth Cell width
 * CellHeight
 * Nr number of cell to build up
 * add_reminder usually width devided by Nr could give some remider that will be added to last cell
 */

Badge.prototype.place_horizontalCell = function(doc,Cellbez, CellsTop,CellHeight,  add_reminder) {
   // calculate reminder
    
    var temp_x      = this.leftMargin;
    Nr=parseInt(Cellbez.length);    
    // looping to Nr
    for (i = 1; i <= Nr; i++) {
        CellWidth       =parseInt(Cellbez[i-1].width);
        CellTxt         =Cellbez[i-1].txt;
        CellBgcolor     =Cellbez[i-1].bgcolor;
        CellTxtColor    =Cellbez[i-1].color;
        CellTyp         =Cellbez[i-1].typ;
        offseY          =parseInt(Cellbez[i-1].offseY);
        fontSize        =Cellbez[i-1].fontSize;
        CellLineWidth   =2;

        doc.lineJoin("miter").rect((temp_x), CellsTop, CellWidth, CellHeight, 15).lineWidth(CellLineWidth).fillAndStroke(CellBgcolor, 'black').stroke();
/**
 * Add Bezeicnung
 */
      if(CellTyp==='BARCODE'){
        doc.font('fonts/ConnectCode39.ttf').fontSize(fontSize).fillColor('black').text('*' + CellTxt + '*', temp_x, (CellsTop + offseY), {
            width: CellWidth,
            align: 'center',
            columns: 1
        });
      }else{
        doc.font(this.fonts_path).fontSize(fontSize).fillColor(CellTxtColor).text(CellTxt, temp_x, (CellsTop+offseY), {
            width:  CellWidth,
            align:  'center',
            columns: 1
        });
      }
       

    

        temp_x = temp_x + CellWidth;
    }
}

Badge.prototype.build_mainframe = function(doc,svg,cells) {
    var leftMargin = this.leftMargin;
    var topMargin = this.topMargin;
    var badgeWidth = this.badgeWidth;
    var badgeHight = this.badgeHeight;

    badgeHight                  = badgeHight - topMargin;
    
    var bottomSektionHeight     = 20;// Section where Klass and Klassbez are placed
    var cardcodeSektionHeight   = 35;// Section where Breakout -Session Cells and Barcode are placed
    var FirstCellsToHeight      = 30; // Section where Individual event value are placed
    
    var bottomSektionTop        = badgeHight - bottomSektionHeight;

    this.cardcodeY              = bottomSektionTop - cardcodeSektionHeight;
    this.cardcodeTop            = this.cardcodeY - 5;
    this.FirstCellsTop          = this.cardcodeTop - FirstCellsToHeight;

   
   
   if(cells['FirstCells_Array'].length>0){
            this.place_horizontalCell(doc,cells['FirstCells_Array'],this.FirstCellsTop,FirstCellsToHeight, true);
    }
    if(cells['barcodeCells_Array'].length>0){
            this.place_horizontalCell(doc,cells['barcodeCells_Array'], this.cardcodeTop, cardcodeSektionHeight + 3,false);
    }

    


    doc.lineJoin("round").roundedRect(leftMargin, 15, badgeWidth, badgeHight, 15).lineWidth(2).stroke();

    doc.lineJoin("round")
        .roundedRect((this.SimpleCellWidth + leftMargin), bottomSektionTop, (badgeWidth - this.SimpleCellWidth), bottomSektionHeight + 15, 15)
        .lineWidth(2)
        .fillAndStroke(this.bottomcolor, '#000')
        .stroke();

    //Linea verticale di divisione
    doc.lineCap("butt")
        .moveTo((this.SimpleCellWidth + leftMargin), (bottomSektionTop - 2))
        .lineTo((this.SimpleCellWidth + leftMargin), (badgeHight + topMargin + 4))
        .stroke();
        
    // Linea di copertura
    // doc.lineCap("butt")
    //     .moveTo(leftMargin, bottomSektionTop - 2)
    //     .lineTo((badgeWidth + leftMargin), bottomSektionTop - 2)
    //     .stroke();

    var line_klass_right_margin = leftMargin + this.SimpleCellWidth - 2;

    // rettangolo di correzione bottom_top
    doc.lineJoin("round")
        .rect(line_klass_right_margin + 4, bottomSektionTop, (badgeWidth - this.SimpleCellWidth - 4), bottomSektionHeight, 15)
        .lineWidth(2)
        .fillAndStroke(this.bottomcolor, this.bottomcolor)
        .stroke();

    // rettangolo di correzione bottom_right
    doc.lineJoin("miter")
        .rect(line_klass_right_margin + 4, bottomSektionTop, 50, bottomSektionHeight + 13, 15)
        .lineWidth(2)
        .fillAndStroke(this.bottomcolor, this.bottomcolor)
        .stroke();

    doc.font(this.fonts_path).fontSize(25).fillColor('black').text(this.klass, this.leftMargin, (bottomSektionTop), {
        width: (this.SimpleCellWidth - 2),
        align: 'center',
        columns: 1
    });
    doc.fontSize(25).fillColor(this.klassBezeichnungColor).text(this.bezeichnung, (this.leftMargin + this.SimpleCellWidth), (bottomSektionTop), {
        width: (badgeWidth - this.SimpleCellWidth - 2),
        align: 'center',
        columns: 1
    });

    // Firma and Funktion can be on two line depends how long they are . If there are split in more than 1 line 
    // fontsize and abstand should be reduced.
    // Class setting automation in funktion
    // this.setFirma
    // this.setFunktion
    // this.setFirmaFunktionParam
    if (this.funktion.length > 0) {
        this.SplitInArray(this.funktion, this.funktionDevider);
    }

    this.badgedata.push({'value': 'LINEA_HORIZONTAL','abstand': 10,'fontSize': 10});

    if (this.firma.length > 0) {
        this.SplitInArray(this.firma, this.firmaDevider);
    }

    SVGtoPDF(doc,svg, (this.leftMargin + 13), (this.topMargin + 10));
}

Badge.prototype.set_FirstCellData = function(doc,CellWidth,cardcode) {
    arr=[];
    if(this.event_typ==='ECS'){
        arr.push({'txt':this.t1,'fontSize':20,'color':'black','bgcolor':this.FirstCellDataBackgroundColor,'width':CellWidth,'offseY':2});
        arr.push({'txt':this.t2,'fontSize':20,'color':'black','bgcolor':this.FirstCellDataBackgroundColor,'width':CellWidth+2,'offseY':2});
        arr.push({'txt':this.t3,'fontSize':20,'color':'black','bgcolor':this.FirstCellDataBackgroundColor,'width':CellWidth+3,'offseY':2});
    }else if(this.event_typ==='SIF'){

        /**
         * -- Swiss Innovation Forum -- 
         * -- ab 2017 in badge mussen wir zeichen die auswahl. Ich Bin Ein --
         */
        doc.lineJoin("miter").rect(this.leftMargin, 240, this.badgeWidth, 20, 15).lineWidth(1).fillAndStroke('#e7e7e7', 'black').stroke();
        doc.font(this.fonts_path).fontSize(15).fillColor('black').text(this.ICH_BIN_EIN, this.leftMargin, 238, {width: this.badgeWidth,align: 'center',columns: 1});
        doc.font(this.fonts_path).fontSize(16).fillColor('black').text(this.ICH_BIN_EIN_antwort , this.leftMargin, 258, {width: this.badgeWidth,align: 'center',columns: 1});
    }
    return arr;
}
Badge.prototype.callbackPippo = function(err,rows,fields) {
    console.log(rows);
   
};


Badge.prototype.set_CardcodeCellData = function(CellWidth,cardcode,cellNr=2) {
 var arr=[];
 if(cellNr==1){
    arr.push({'txt':this.b1,'fontSize':20,'color':'black','bgcolor':'white','width':(CellWidth*2),'offseY':5});
 }else{
    arr.push({'txt':this.b1,'fontSize':20,'color':'black','bgcolor':'white','width':CellWidth,'offseY':5});
    arr.push({'txt':this.b2,'fontSize':20,'color':'black','bgcolor':'white','width':CellWidth,'offseY':5});
 }

 arr.push({'txt':this.cardcode,'fontSize':14,'color':'black','bgcolor':'white','width':CellWidth*4+5,'offseY':5,'typ':'BARCODE'});

 return  arr;
}
module.exports = Badge;
