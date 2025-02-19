module.exports = {
    rules: {
      'no-mixed-spaces-and-tabs': 'off',
        "no-unused-vars": "warn", // 只发出警告而不是错误
        "vue/no-unused-vars": "warn"
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      'plugin:vue/vue3-essential',  // Vue 3
      'eslint:recommended',
    ],
};