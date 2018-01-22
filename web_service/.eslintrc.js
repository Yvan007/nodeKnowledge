// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 空格2个
    'indent': ['error', 2, {'SwitchCase': 1}],
    // // 双峰驼命名格式
    // 'camelcase': 2,
    // 控制逗号前后的空格
    'comma-spacing': [2, {'before': false, 'after': true}],
    // 禁止不必要的分号
    'semi':['error', 'never'],
    // 强制使用单引号
    'quotes': ['error', 'single'],
    // 控制逗号在行尾出现还是在行首出现
    'comma-style': [2, 'last'],
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    'comma-dangle': [2, 'never'],
    // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
    "no-empty-function":2,
    // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    // "no-undef": 2,
    // 禁止在代码行后使用内联注释
    "no-inline-comments": 0,
    // 强制在注释中 // 或 /* 使用一致的空格
    "spaced-comment": 1
  }
}
