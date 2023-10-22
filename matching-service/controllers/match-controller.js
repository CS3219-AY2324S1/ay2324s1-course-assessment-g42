const rpc_client = require('../rpc_client.js');

async function sendMatchingRequest(req, res) {
    try {
      const { username, complexity, timeOfReq } = req.body;
      const matchedUser = await rpc_client.sendMatchingRequest(username, complexity, timeOfReq);
      
      return res.status(200).send(matchedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while sending your match request' });
    }
  }

  module.exports = { sendMatchingRequest };