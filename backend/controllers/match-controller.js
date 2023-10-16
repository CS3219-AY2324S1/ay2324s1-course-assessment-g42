async function sendMatchingRequest(req, res) {
    try {
      const rpc_client = require('../matching-service/rpc_client.js');
      const { username, complexity } = req.body;
      const matchedUsername = await rpc_client.main(username, complexity);
      
      return res.status(200).send(matchedUsername);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  }

  module.exports = { sendMatchingRequest };