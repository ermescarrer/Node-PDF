"use strict"
var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
var fs = require('fs');

        var doc                     = new PDFDocument();
        var stream                  = doc.pipe(blobStream());
        var leftMargin              = 0;
        var topMargin               = 10;

// un testo di esempio
 var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus.  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl.'

 doc.fontSize(9).text('Wally Gator !', 5, 10);
 // Set the paragraph width and align direction ss
 doc.text('Wally Gator is a swinging alligator in the swamp. He\'s the greatest percolator when he really starts to romp. There has never been a greater operator in the swamp. See ya later, Wally Gator.', {
     width: 500,
     align: 'left'
 });

 doc.moveDown()
 doc.text('Wally Gator is a swinging alligator in the swamp. He\'s the greatest percolator when he really starts to romp. There has never been a greater operator in the swamp. See ya later, Wally Gator.', {
    width: 500,
    align: 'center'
});

doc.moveDown()
doc.fontSize(15).text('Wally Gator is a swinging alligator in the swamp. He\'s the greatest percolator when he really starts to romp. There has never been a greater operator in the swamp. See ya later, Wally Gator.', {
    width: 500,
    align: 'justify'
});


// draw bounding rectangle
//doc.rect(doc.x, 0, 410, doc.y).stroke()

        
        doc.flushPages();
        var max=1000;
        var min=100;
        var random=Math.floor(Math.random() * (max - min)) + min;
        
        doc.pipe(fs.createWriteStream(__dirname+'/pippo_' + random + '.pdf'));
        doc.pipe;
        doc.end();
        console.log('-- Alles Vertig ---');
