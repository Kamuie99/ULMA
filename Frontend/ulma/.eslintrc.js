module.exports = {
  env: {
    node: true, // Node.js 환경에서 동작함을 명시
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint 규칙 사용
    'plugin:prettier/recommended', // Prettier 규칙을 ESLint에 적용
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
