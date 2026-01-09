const bcrypt = require('bcrypt')

async function encryptedCode(code) {
    const saltRounds = 10
    const hash = await bcrypt.hash(code , saltRounds)
    return hash
}

async function decryptedCode(code , encryptCode) {
    const decrypt = await bcrypt.compare(code , encryptCode)
    return decrypt
}

module.exports = { encryptedCode , decryptedCode }