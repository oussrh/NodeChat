let jwt = require('jsonwebtoken');
const JWT_SECRET = '0sj54sdf5k4hj64kjhk897ghj123ghn12lyu3pui12sdf123s58';

module.exports = {
    UserToken :(data) => {
        return jwt.sign({
            userId: data._id,
        },
        JWT_SECRET,
        {
           expiresIN : '1h' 
        });
    }
};