async function sendMatchingRequest(req, res) {
    try {
      const rpc_client = require('../rpc_client.js');
      const { userObj, complexity, timeOfReq } = req.body;
      const matchedUser = await rpc_client.main(userObj, complexity, timeOfReq);
      
      return res.status(200).send(matchedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  }

  module.exports = { sendMatchingRequest };