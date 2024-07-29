const bcrypt = require("bcryptjs");

// Compare raw password to encrypted password
async function comparePasswords(plaintextPassword, encryptedPassword) {
  try {
    const doesPasswordMatch = await bcrypt.compare(
      plaintextPassword,
      encryptedPassword
    );
    return doesPasswordMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

module.exports = { comparePasswords };
