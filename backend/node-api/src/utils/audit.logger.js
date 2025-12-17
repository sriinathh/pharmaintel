const fs = require('fs')
const path = require('path')

const auditFile = path.resolve(process.cwd(), 'audit.log')

function log(entry) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n'
  fs.appendFile(auditFile, line, (err) => { if (err) console.error('Audit log error', err) })
}

module.exports = { log }
