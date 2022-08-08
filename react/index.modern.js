var mail = function mail(config) {
  try {
    return Promise.resolve(fetch("/api/mailer", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })).then(function (response) {
      return Promise.resolve(response.json());
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = mail;
//# sourceMappingURL=index.modern.js.map
