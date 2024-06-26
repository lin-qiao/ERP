module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`
        }
      }
    ],
    '@vue/babel-plugin-jsx'
    // "@babel/plugin-syntax-dynamic-import",
    // "syntax-dynamic-import",
    // "dynamic-import-node"
  ]
}
