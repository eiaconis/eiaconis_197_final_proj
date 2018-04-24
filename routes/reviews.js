var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

router.get('/new', function (req, res, next) {
  res.render('addreview');
});

router.post('/new', function (req, res, next) {
  var currRating = Number(req.body.rating);
  var currClassname = req.body.className;
  var currSemester = req.body.semester;
  var currReview = req.body.text;
  if ((currRating && currClassname) && (currSemester && currReview)) {
    reviewsDb.addReview({className: currClassname, rating: currRating, semester: currSemester, text: currReview}, 
      function (err) {
        if (err) {
          next(err);
        } else {
          res.send('Successfully added review!');
        }
      });
  } else {
    next(new Error('Incomplete review.'));
  }
});


module.exports = router;
