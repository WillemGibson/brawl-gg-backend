const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createUserJWT = (userDetailsToEncrypt) => {
  return jwt.sign(userDetailsToEncrypt, process.env.USER_JWT_SECRET, {
    expiresIn: "30m",
  });
};

const userValidateJWTAndRefreshIt = (request, response, next) => {
  let suppliedToken = request.headers.jwt;
  console.log(suppliedToken);

  // jwt.verify(token, secret, callback function);
  jwt.verify(
    suppliedToken,
    process.env.USER_JWT_SECRET,
    (error, decodedJWT) => {
      if (error) {
        console.log(error);
        throw new Error("User not authenticated.");
      }

      // VALID THE USER LOGIN CREDIENTALS

      // User doesn't have to manually sign in again if they're still using the app before the token expires.
      let freshJWT = generateJWT({
        userId: decodedJWT.userId,
        username: decodedJWT.username,
        password: decodedJWT.password,
        isAdmin: decodedJWT.isAdmin,
      });

      request.freshJWT = freshJWT;
    }
  );

  next();
};

module.exports = {
  createUserJWT,
  userValidateJWTAndRefreshIt,
};
