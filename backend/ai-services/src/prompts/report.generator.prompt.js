module.exports = ({ title, data, language }) => {
  return `Generate a clinical-style report titled: ${title} in ${language}.
Use data: ${JSON.stringify(data)}

Include: summary, findings, recommended actions, and a clear educational disclaimer.`
}
