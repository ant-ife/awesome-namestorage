module.exports = {
  babelrc: {
    presets: [
      'es2015',
      'stage-0'
    ],
    plugins: [
    ],
    sourceMaps: 'inline'
  },
  extensions: ['.js'],
  include: [
    'src/**/*.js',
    'test/**/*.js'
  ],
  exclude: [
    'node_modules/**'
  ]
}

