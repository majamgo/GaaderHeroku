const express = require('express');
const router = express.Router();
const Gaade = require('../models/gaade.model');


// http://localhost:5050/gaader/test
router.get('/test', (req, res) => {
  res.send('Dette er en test af routeren');
});


// Getting all - http://localhost:5050/gaader
router.get('/', async (req, res) => {
    try {
      const gaader = await Gaade.find();
      res.json(gaader);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Getting one
  router.get('/:id', getGaade, (req, res) => {
    res.json(res.gaade);
  });
  

  //  ----- *** ADMIN ROUTES *** -----------------------------


  // Creating one - http://localhost:5050/admin/gaader
  router.post('/admin', async (req, res) => {
    // Gem den nye gaade:
  
      const postedgaade = new Gaade({
        gaade: req.body.gaade,
        svar: req.body.svar
      });

    try {
      const oprettetgaade = await postedgaade.save();
      res.status(201).json(oprettetgaade);
    } catch (err) {
      res.status(400).json({ message: 'FEJL - Noget gik galt: ' + err.message });
    }
  });
  

  // Updating one
  router.patch('/admin/:id', getGaade, async (req, res) => {
  
    try {
  
      res.gaade.gaade = req.body.gaade;
      res.gaade.svar = req.body.svar;
  
        await res.gaade.save();
        res.status(200).json({ message: "Gaaden er rettet" });
  
    } catch (err) {
      res.status(400).json({ message: 'FEJL - Noget gik galt:' + err.message });
    }
  });
  

  // Deleting one
  router.delete('/admin/:id', getGaade, async (req, res) => {
    try {
      await res.gaade.remove();
      res.json({ message: 'Slettet gaade' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  async function getGaade(req, res, next) {
    let udvgaade;
  
    try {
      udvgaade = await Gaade.findById(req.params.id);
  
      if (udvgaade == null) {
        return res.status(404).json({ message: 'Kan ikke finde gaade' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.gaade = udvgaade;
    next();
  }

module.exports = router;