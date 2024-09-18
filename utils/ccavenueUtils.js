var crypto = require("crypto");
function getAlgorithm(keyBase64) {
  var key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
}

exports.encrypt = (plainText) => {
  const working_key = process.env.CC_WORKING_KEY;
  const m = crypto.createHash("md5");
  m.update(working_key);
  const key = m.digest();
  const iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");
  return encoded;
};

exports.decrypt = (encText) => {
  const working_key = process.env.CC_WORKING_KEY;
  const m = crypto.createHash("md5");
  m.update(working_key);
  const key = m.digest();
  const iv = "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return decoded;
};
