const express = require("express");
const mongoose = require("mongoose");

const Phone = require("../models/phone-model");

const router = express.Router();

// POST /api/phones
router.post("/phones", (req, res, next) => {
  const { brand, name, image, specs } = req.body;

  Phone.create({ brand, name, image, specs })
    .then((newPhone) => {
      res.json(newPhone);
    })
    .catch((err) => {
      next(err)
    });
});

// GET /api/phones
router.get("/phones", (req, res, next) => {
  Phone
    .find()
    .limit(20)
    .sort({ createdAt: -1 })
    .then((phones) => {
      res.json(phones);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /api/phone/:phoneId
router.get("/phone/:phoneId", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.phoneId)) {
    next(); // show 404 if bad ObjectId format
    return;
  }

  Phone.findById(req.params.phoneId)
    .then((phone) => {
      if (!phone) {
        next(); // show 404 if no phone was found
        return;
      }

      res.json(phone);
    })
    .catch((err) => {
      next(err);
    });
});

// PUT /api/phone/:phoneId
router.put("/phone/:phoneId", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.phoneId)) {
    next(); // show 404 if bad ObjectId format
    return;
  }

  const { brand, name, image, specs } = req.body;

  Phone.findByIdAndUpdate(
    req.params.phoneId,
    { brand, name, image, specs },
    { runValidators: true, new: true } // "new" gets us the updated version
  )
  .then((updatedPhone) => {
    if (!updatedPhone) {
      next(); // show 404 if no phone was found
      return;
    }

    res.json(updatedPhone);
  })
  .catch((err) => {
    next(err);
  });
});

// DELETE /api/phone/:phoneId
router.delete("/phone/:phoneId", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.phoneId)) {
    next(); // show 404 if bad ObjectId format
    return;
  }

  Phone.findByIdAndRemove(req.params.phoneId)
    .then((removedPhone) => {
      if (!removedPhone) {
        next(); // show 404 if no phone was found
        return;
      }

      res.json(removedPhone);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
