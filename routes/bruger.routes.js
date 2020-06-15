const express = require('express');
const router = express.Router();
const Bruger = require('../models/bruger.model');


// http://localhost:5050/bruger/test
router.get('/test', (req, res) => {
  res.send('Dette er en test af routeren');
});


// http://localhost:5050/admin/bruger
router.get('/', async (req, res) => {

  try {
    const bruger = await Bruger.find();

    res.json(bruger);
  } catch (err) {
    res.status(500).json({ message: "Der var en fejl - " + err.message })
  }
});

  
  // Getting one
  router.get('/:id', getBruger, (req, res) => {
    res.json(res.bruger);
  });
  

  // Creating one - http://localhost:5050/admin/bruger
  router.post('/', async (req, res) => {
    // Gem den nye bruger:
   try {  
      let bruger = await Bruger.findOne({ email: req.body.email })
  
      if (bruger) {
        return res.status(401).json({ message: "Brugeren findes allerede" });
      } else {
        bruger = new Bruger(req.body);
        const nybruger = await bruger.save();
        return res.status(201).json({ message: "Ny bruger er oprettet", nybruger: nybruger });
      }     
    } catch (err) {
      res.status(400).json({ message: 'FEJL - Noget gik galt: ' + err.message });
    }
  });
  

  // Updating one
  router.put('/:id', getBruger, async (req, res) => {
  
    try {
  
      res.bruger.brugernavn = req.body.brugernavn;
      res.bruger.email = req.body.email;
      res.bruger.password = req.body.password;
  
        await res.bruger.save();
        res.status(200).json({ message: "brugeren er rettet" });
  
    } catch (err) {
      res.status(400).json({ message: 'FEJL - Noget gik galt:' + err.message });
    }
  });
  

  // Deleting one
  router.delete('/:id', getBruger, async (req, res) => {
    try {
      await res.bruger.remove();
      res.status(200).json({ message: 'Slettet bruger' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  async function getBruger(req, res, next) {
    let udvbruger;
  
    try {
      udvbruger = await Bruger.findById(req.params.id);
  
      if (udvbruger == null) {
        return res.status(404).json({ message: 'Kan ikke finde bruger' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.bruger = udvbruger;
    next();
  }


module.exports = router;