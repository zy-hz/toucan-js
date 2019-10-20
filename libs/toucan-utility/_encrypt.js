// 加密

const { createHash } = require('crypto');

function encrypt(algorithm, content) {
    let hash = createHash(algorithm);
    hash.update(content);
    return hash.digest('hex');
}

const md5 = (content) => { return encrypt('md5', content) };
const sha1 = (content) => { return encrypt('sha1', content) };
module.exports = { md5, sha1 }