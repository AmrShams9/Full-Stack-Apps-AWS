import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get("/filteredimage", async (req, res) => {
  // Get the image URL from query parameters
  const image_url = req.query.image_url;

  // Validate the image URL
  if (!image_url) {
    return res.status(400).send('Image URL is required');
  }

  try {
    console.log('Image URL:', image_url);

    // Call the filterImageFromURL function to process the image
    const filteredImagePath = await filterImageFromURL(image_url);
    console.log('Filtered image saved at:', filteredImagePath);

    // Send the filtered image file back to the client
    res.status(200).sendFile(filteredImagePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).send('Error sending the file');
      }
      // Delete the local file after response finished
      deleteLocalFiles([filteredImagePath]);
    });

  } catch (error) {
    console.error('Error processing image:', error);
    // Respond with 422 Unprocessable Entity if processing fails
    res.status(422).send('Unable to process the image');
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
