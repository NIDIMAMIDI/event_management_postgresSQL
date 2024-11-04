import { hashPassword, passwordChecking } from '../../helpers/bcrypt/bcrypt.helpers.js';
import { User } from '../../models/user/user.models.js';
import { createToken } from '../../helpers/jwt/jwt.helpers.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const loweredEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: loweredEmail } });
    if (existingUser) {
      return res.status(400).json({
        status: 'failure',
        message: `User with email ${loweredEmail} already exists`
      });
    }

    // Hash the password with bcrypt
    const hashedPassword = await hashPassword(password, 12);

    // Create a new user in the database with the hashed password
    const newUser = await User.create({
      username,
      email: loweredEmail,
      password: hashedPassword
    });

    // Create a JWT token and get cookie options
    const { token, cookieOptions } = createToken(newUser);

    // Store the generated token in the User model
    await User.update({ token }, { where: { id: newUser.id } });

    // Fetch updated user info
    const updatedUser = await User.findByPk(newUser.id);

    // Set the token as a cookie in the response
    res.cookie('jwt', token, cookieOptions);

    // Send a success response with the newly created user and token
    res.status(201).json({
      status: 'success',
      message: `${newUser.username}'s registration successful`,
      user: updatedUser
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const login = async (req, res, next) => {
  try {
    // fetching validated data from the authValidator
    const { email, password } = req.body;

    // converting email to a lowerCase
    const loweredEmail = email.toLowerCase();

    // check if user email exists in database
    const user = await User.findOne({ where: { email: loweredEmail } });

    // if user does not found with the provided mail it will give error response
    if (!user) {
      return res.status(500).json({
        status: 'failure',
        message: `User with ${email} doesn't exists`
      });
    }

    // check if password is correct or not
    const isPAsswordCorrect = await passwordChecking(password, user.password);

    // if provided password does not match stored password it will throw the error response
    if (!isPAsswordCorrect) {
      return res.status(500).json({
        status: 'failure',
        message: 'Invalid Password'
      });
    }

    // fetching jwt token and cookie options
    const { token, cookieOptions } = await createToken(user);

    // Store the generated token in the User model
    await User.update({ token }, { where: { id: user.id } });

    const updatedUser = await User.findByPk(user.id);

    // setting token as a cookie
    res.cookie('jwt', token, cookieOptions);

    const {
      password: pwd,
      createdAt,
      updatedAt,
      ...userDetails
    } = updatedUser.dataValues;

    // success response
    res.status(200).json({
      status: 'success',
      message: `User ${user.username}'s Login Successfull`,
      userDetails
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear the token in the database
    const user = req.user;
    const userDetails = await User.findByPk(user.id);
    if (!userDetails) {
      return res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }
    await User.update({ token: null }, { where: { id: userDetails.id } });

    // Clear the JWT cookie by setting it to an expired date
    res.cookie('jwt', '', {
      expires: new Date(0), // Expire the cookie
      httpOnly: true // Ensures the cookie is accessible only by the web server
    });

    // Send a successful response
    res.status(200).json({
      status: 'success',
      message: `${userDetails.username} Logged out successful`
    });
  } catch (err) {
    return res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
