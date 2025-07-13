import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // 1. Validate the image_url query
  if (!image_url) {
    return res.status(400).send({ message: 'image_url is required' });
  }

  try {
    // 2. Call filterImageFromURL(image_url) to filter the image
    const filteredPath = await filterImageFromURL(image_url);

    // 3. Send the resulting file in the response
    res.sendFile(filteredPath, {}, (err) => {
      if (err) {
        res.status(500).send({ message: 'Error sending the file' });
      }

      // 4. Delete any files on the server on finish of the response
      deleteLocalFiles([filteredPath]);
    });
  } catch (error) {
    res.status(422).send({ message: 'Unable to process image URL' });
  }
});

// Root Endpoint
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});
