const express = require('express');

const  data= require("../data/db");

const router = express.Router();

//This handles the router 'Get /data'
router.get('/api/data', (req, res) => {
  // these options are supported by the `data.find` method,
	// so we get them from the query string and pass them through.
	const options = {
		// query string names are CASE SENSITIVE,
		// so req.query.sortBy is NOT the same as req.query.sortby
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

  data.find(options)
  .then(data => {
    res.status(200).json(data);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the data',
    });
  });
});

//This handles the route `Get/ data/:id`
router.get('/api/data/:id', (req, res) => {
  data.findById(req.params.id)
  .then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'data not found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the data',
    });
  });
});

// This handles the route `POST /users`
router.post('/api/data', (req, res) => {
  data.add(req.body)
  .then(data => {
    res.status(201).json(data);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error adding the data'
    });
  });
});

// This handles the route `DELETE /users/:id`
router.delete('/api/data/:id', (req, res) => {
  data.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The data has been nuked' });
    } else {
      res.status(404).json({ message: 'The data could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the data',
    });
  });
});

// This handles the route `PUT /users/:id`
router.put('/api/data/:id', (req, res) => {
  const changes = req.body;
  data.update(req.params.id, changes)
  .then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'The data could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  });
});

// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

// router.listen(4000, () => {
//   console.log('\n*** Server Running on http://localhost:4000 ***\n');
// });

module.exports = router;