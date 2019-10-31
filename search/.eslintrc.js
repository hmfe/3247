module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": [
    "airbnb",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "react/forbid-prop-types": 0,
    "object-curly-newline": 0,
  },
};
