// content of index.js
const http = require("http");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// - Name
// - Title
// - Company
// - Photo
// - Location
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const RequestFetch = async (token, url) => {
  return await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
};

app.post("/me", async (req, res) => {
  const { token } = req.body;

  const getBasicProfile = await RequestFetch(
    token,
    "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,email,profilePicture(displayImage~:playableStreams))"
  );
  const getEmail = await RequestFetch(
    token,
    "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))"
  );
  const payload = {
    ...getBasicProfile.data,
    ...getEmail.data
  };
  return res.send(payload);
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
