function getText({ language, resource }) {
  return function (key: string) {
    return resource[language][key] ?? key;
  };
}

export { getText };
