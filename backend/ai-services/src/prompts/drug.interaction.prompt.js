module.exports = ({ message, language }) => {
  return `Analyze drug interaction query in ${language}.
Question: ${message}

Provide: (1) Interaction summary, (2) Severity, (3) Citations if available, (4) Safe recommendations for educational purposes.`
}
