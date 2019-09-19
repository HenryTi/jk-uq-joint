"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
const saltRounds = 10;
async function hashPassword(pwd) {
    let salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(pwd, salt);
}
exports.hashPassword = hashPassword;
async function comparePassword(pwd, auth) {
    return await bcrypt.compare(pwd, auth) == true;
}
exports.comparePassword = comparePassword;
const algorithm = 'aes-128-cbc';
const cryptoPassword = 'pickering-on-ca';
const keyLength = 16;
function encrypt(pwd) {
    let key = Buffer.concat([Buffer.from(cryptoPassword)], keyLength);
    let iv = crypto.randomBytes(16);
    const mykey = crypto.createCipheriv(algorithm, key, iv);
    // const mykey = crypto.createCipher(algorithm, cryptoPassword);
    let cryptedPwd = mykey.update(pwd, 'utf8', 'hex');
    cryptedPwd += mykey.final('hex');
    return cryptedPwd;
}
exports.encrypt = encrypt;
function decrypt(cryptedPwd) {
    let key = Buffer.concat([Buffer.from(cryptoPassword)], keyLength);
    let iv = crypto.randomBytes(16);
    // const mykeyD = crypto.createDecipheriv(algorithm, key, iv);
    const mykeyD = crypto.createDecipher(algorithm, cryptoPassword);
    // mykeyD.setAutoPadding(false);
    let str = mykeyD.update(cryptedPwd, 'hex', 'utf8');
    str = mykeyD.final('utf8');
    return str;
}
exports.decrypt = decrypt;
//# sourceMappingURL=hashPassword.js.map