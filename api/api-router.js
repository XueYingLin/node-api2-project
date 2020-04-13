const express = require('express');

const  data= require("../data/db");

const router = express.Router();

//This handles the router 'Get /data'
router.get('/posts', (req, res) => {
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

// When the client makes a POST request to /posts:
router.post('/posts', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      error: "Please provide title and contents for the post."
    })
  }

  data.add(req.body)
  .then(data => {
    res.status(201).json(data);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'There was an error while saving the post to the database'
    });
  });
});

//When the client makes a POST request to /posts/:id/comments: 
router.post('/posts/:id/comments', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment."
    })
  }

  data.findById(req.params.id).then(getPostResponse => {
    if (getPostResponse.length != 1) {
      return res.status(400).json({
        message: "The post with the specified ID does not exist." 
      });
    } else {
      data.insertComment(req.body)
      .then((r) => {
        data.findCommentById(r.id).then(comment => {
          res.status(201).json(comment[0]);
        })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          error: "There was an error while saving the comment to the database" 
        })
      })   
    }
    console.log(getPostResponse);
  });


})

//When the client makes a GET request to /posts:
router.get('/posts', (req, res) => {
  data.findPostComments(req.params.id)
    .then((post) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        error: "The posts information could not be retrieved." 
      })
    })
})

//When the client makes a GET request to /posts/:id:
router.get('/posts/:id', (req, res) => {
  console.log("Here with id", req.params.id);
  data.findById(req.params.id)
    .then((data) => {
      console.log(data);
      if (data.length == 1) {
        res.status(200).json(data[0])
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist." 
        })
      }
    })
    .catch ((error) => {
      console.log(error)
      res.status(500).json({
        error: "The post information could not be retrieved."
      })
    })
})

//When the client makes a GET request to /posts/:id/comments: 
router.get('/posts/:id/comments', (req, res) => {
  const id = req.params.id;

  data.findById(id).then(post => {
    if (post.length == 0) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      })
    } else {
      data.findPostComments(id).then(comments => {
        if (comments) {
          res.status(200).json(comments)
        } else {
          res.status(500).json({
            error: "The comments information could not be retrieved." 
          })
        }  
      })
    }
  })
})

// When the client makes a DELETE request to /posts/:id: 
router.delete('/posts/:id', (req, res) => {
  data.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The data has been nuked' });
    } else { 
      res.status(404).json({ message: "The post with the specified ID does not exist."  });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post could not be removed" 
    });
  });
});

// When the client makes a PUT request to /posts/:id:
router.put('/posts/:id', (req, res) => {
  // const changes = req.body;
  // data.update(req.params.id, changes)
  
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({errorMessage: "Please provide title and contents for the post."})
  }
  const changes = req.body;
  data.update(req.params.id, changes)
  .then(updated => {
    if (updated) {
      data.findById(req.params.id).then(response => {
        console.log(response);
        res.status(200).json(response[0]);
      })
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post information could not be modified.",
    });
  });


});

module.exports = router;