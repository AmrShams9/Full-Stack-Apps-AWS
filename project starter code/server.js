import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get( "/filteredimage", async (req, res) => {
     // Get the image URL from the query parameters
     const image_url = req.query.image_url;

     // Validate the image URL
     if (!image_url) {
         return res.status(400).send('Image URL is required');
     }
 
     try {
         console.log('Image URL:', image_url);
         // Call the filterImageFromURL function
         let filteredImagePath = await filterImageFromURL(image_url);
         
         console.log('New URL:', filteredImagePath)
 
         // Send the filtered image back to the client
         res.status(200).sendFile(filteredImagePath, () => {
             // Delete the local file after sending it
             deleteLocalFiles([filteredImagePath]);
         });
     } catch (error) {
         // Handle errors (e.g., if the image cannot be processed)
         res.status(422).send('Unable to process the image');
     }
  } );
// Root Endpoint
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});
