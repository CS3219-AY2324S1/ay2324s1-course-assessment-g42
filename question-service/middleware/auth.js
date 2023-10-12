const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
        const token = req.cookies.token;

        if (token) {
            const decode = jwt.verify(token, jwtSecretKey);
            if (decode) {
                console.log("verified");
                next();
            }
        } else {
            // Access Denied
            console.log("Access Denied");
            return res.status(401).json({
                login: false,
                data: 'error'
            })

        }
    } catch (error) {
        // Access Denied
        console.log("Token Invalid");
        return res.status(401).send({error: 'Invalid token'});
    }
}

module.exports = verifyToken;
