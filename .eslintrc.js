// http://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: 'eslint-config-antife',

  plugins: [
    "babel",
    "html",
  ],

  "globals": {
    "ant": true,
    "Tracert": true,
    "overseasutil": true,
    "Chameleon": true,
    "google": true,
    "Vue": true,
    "intlcouponsdk": true,
    "ap": true,
  },
}
