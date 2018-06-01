/**
 *
 */
'use strict';

const fs = require('fs');
var natural = require('natural');
var express = require('express');
var router = express.Router();
const csv=require('csvtojson');


/* CSV */
router.post('/csv', function(req, res, next) {
    console.log("data");
    var sentance = req.body.fileData;
    var myFileText = req.body.myFileText;
    console.log(myFileText);
    var myObj = []

    csv()
        .fromString(sentance)
        .on('json',(jsonObj)=>{
            // combine csv header row and csv line to a json object
            // jsonObj.a ==> 1 or 4
            // console.log("hi");
            myObj.push(jsonObj);
            //console.log(jsonObj);
        })
        .on('done',(error)=>{
            console.log('end')
            //console.log(myObj);

            // for (var key in myObj) {
            //     if (myObj.hasOwnProperty(key)) {
            //         //console.log(key + " -> " + student[key].class_actual);
            //         //console.log(key + " -> " + student[key].text);
            //         console.log("hi Rajat");
            //         console.log(mineData(myObj[key].text));
            //         myObj[key].predection = mineData(myObj[key].text);
            //     }
            // }
            res.status(200).json({
                result: mineDataCsv(myObj,myFileText)
            });
        })




});

/* GET home page. */
router.post('/', function(req, res, next) {
    var sentance = req.body.sen;
    console.log(sentance);
    var result = mineData(sentance);

    // res.render('index', { title: 'Express' });
    res.status(200).json({
        result: result
    });
});

function mineData(sentance){
    var classifier = new natural.BayesClassifier();

    let rawdata = fs.readFileSync('data.json');
    let student = JSON.parse(rawdata);


    for (var key in student) {
        if (student.hasOwnProperty(key)) {
            // console.log(key + " -> " + student[key].class_actual);
            console.log(key + " -> " + student[key].text);
            classifier.addDocument(student[key].text, student[key].class_actual);
        }
    }
    classifier.train();

    var text = '{[Important information + source]:  Electrons protons are made of things called quark. }'
    var raw = JSON.stringify(classifier);
//deserialize
    var restoredClassifier = natural.BayesClassifier.restore(JSON.parse(raw));

    //console.log("Classification Using Restored Classfier");
    //console.log(restoredClassifier.classify());

    //console.log("Classification Using In class Classfier");
    //console.log(classifier.classify('{[Important information + source]:  Electrons protons are made of things called quark. }'));

    return classifier.classify(sentance);
}


function mineDataCsv(myObj,data1){
    var classifier = new natural.BayesClassifier();

    let rawdata = fs.readFileSync('data.json');
    let student = JSON.parse(rawdata);


    for (var key in student) {
        if (student.hasOwnProperty(key)) {
            // console.log(key + " -> " + student[key].class_actual);
            // console.log(key + " -> " + student[key].text);
            classifier.addDocument(student[key].text, student[key].class_actual);
        }
    }
    classifier.train();

    var text = '{[Important information + source]:  Electrons protons are made of things called quark. }'
    var raw = JSON.stringify(classifier);
//deserialize
    var restoredClassifier = natural.BayesClassifier.restore(JSON.parse(raw));


    console.log("----------------------------------"+data1);

    for (var key in myObj) {
        if (myObj.hasOwnProperty(key)) {

            console.log(key + " -> " + myObj[key][data1]);

            myObj[key].predection = classifier.classify(myObj[key][data1]);
        }
    }




    return myObj;
}

module.exports = router;