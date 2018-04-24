var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

var checkValidKey = require('../middlewares/checkValidKey');

// Implement the routes.
router.get('/all', function (req, res, next) {
  reviewsDb.getAllReviews(function (err, allReviews) {
    if (err) {
      next(err);
    } else {
      res.send(allReviews);
    }
  });
});

router.get('/search/:className', function (req, res, next) {
  var className = req.params.className;
  reviewsDb.getReviewsByClassName(className, function (err, allReviews) {
    if (err) {
      next(err);
    } else {
      res.send(allReviews);
    }
  });
});

module.exports = router;
