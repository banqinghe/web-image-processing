function getText({ language, resource }) {
  return function (key) {
    return resource[language][key] ?? key;
  };
}

export { getText };
