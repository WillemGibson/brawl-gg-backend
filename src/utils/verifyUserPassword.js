const bcrypt = require("bcryptjs");
const {
  MAX_ACCESS_BOUNDARY_RULES_COUNT,
} = require("google-auth-library/build/src/auth/downscopedclient");

// Compare raw password to encrypted password
async function comparePasswords(plaintextPassword, encryptedPassword) {
  let doesPasswordMatch = false;

  doesPasswordMatch = await bcrypt.compare(
    plaintextPassword,
    encryptedPassword
  );

  return doesPasswordMatch;
}

module.exports = { comparePasswords };
