module.exports = ({ message, language }) => {
  return `You are PharmaIntel, a clinical-grade assistant. Respond in ${language}.
User message: ${message}

Include a brief, structured summary and a model-safe medical disclaimer.`
}
