const greeting = {
  en: 'hello',
  fr: 'bonjour',
  ru: 'privet',
  uz: 'salom',
};

exports.handler = async (event) => {
  let name = event.pathParameters.name;
  let { lang, ...info } = event.queryStringParameters;
  let message = `${greeting[lang] ? greeting[lang] : greeting['en']} ${name}`;
  let response = {
    message,
    info,
    timestamp: new Date(), 
  };
  return {
      statusCode: 200, 
      body: JSON.stringify(response)
  }
};
