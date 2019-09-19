import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

const saltRounds = 10;
export async function hashPassword(pwd: string): Promise<string> {
    let salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(pwd, salt);
}

export async function comparePassword(pwd: string, auth: string) {
    return await bcrypt.compare(pwd, auth) == true;
}


const algorithm = 'aes-128-cbc';
const cryptoPassword = 'pickering-on-ca';
const keyLength = 16;

export function encrypt(pwd: string): string {
    let key = Buffer.concat([Buffer.from(cryptoPassword)], keyLength);
    let iv = crypto.randomBytes(16);
    const mykey = crypto.createCipheriv(algorithm, key, iv);
    // const mykey = crypto.createCipher(algorithm, cryptoPassword);
    let cryptedPwd: string = mykey.update(pwd, 'utf8', 'hex');
    cryptedPwd += mykey.final('hex');
    return cryptedPwd;
}

export function decrypt(cryptedPwd: string): string {
    let key = Buffer.concat([Buffer.from(cryptoPassword)], keyLength);
    let iv = crypto.randomBytes(16);
    // const mykeyD = crypto.createDecipheriv(algorithm, key, iv);
    const mykeyD = crypto.createDecipher(algorithm, cryptoPassword);
    // mykeyD.setAutoPadding(false);
    let str = mykeyD.update(cryptedPwd, 'hex', 'utf8');
    str = mykeyD.final('utf8');
    return str;
}
