import { verifyToken } from '../../helpers/jwt/jwt.helpers.js';
import { User } from '../../models/user/user.models.js';

// Authorization Middleware
export const authorization = async (req, res, next) => {
  try {
    // getting the token and check if there is user or not

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // cheching the token is valid or not
    if (!token) {
      return res.status(400).json({
        status: 'failure',
        message: 'You are not logged in (or) Bearer Token is not provided check it Once'
      });
    }

    // verifying the generated token with secret key that we stored in .env file
    const decoded = await verifyToken(token, process.env.JWT_SECRET_KEY);

    // console.log(decoded);

    // check if user exists or not
    // const user = await User.findById(decoded.id);
    const user = await User.findByPk(decoded.id);

    // user does not exist throw error response
    if (!user) {
      return res.status(500).json({
        status: 'failure',
        message: 'The User with the token is no longer exists'
      });
    }

    // assigning authorized user to request object so that it can be used for later use
    // console.log(user);

    req.user = user;

    // next functionality
    next();
  } catch (err) {
    // Token expiration Error
    // console.log(err.stack);
    if (err.name === 'Error') {
      return res.status(401).json({
        status: 'failure',
        message: 'Token expired! Please log in again to get access.'
      });
    }

    // Handle other verification errors
    return res.status(500).json({
      status: 'failure',
      message: 'Failed to authenticate token.'
    });
  }
};
