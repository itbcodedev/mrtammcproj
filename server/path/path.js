const blue_in = require('./bluelinedot_in.json')
const blue_out = require('./bluelinedot_out.json')

const purplenorth_in = require('./purpledot_in.json')
const purplenorth_out = require('./purpledot_out.json')


exports.blue_in = blue_in
exports.blue_out = blue_out

exports.purplenorth_in = purplenorth_in
exports.purplenorth_out = purplenorth_out


exports.config = [
  {
    route_name: "blue", direction: "0", file: "blue_in"
  },
  {
    route_name: "blue", direction: "1", file: "blue_out"
  },
  {
    route_name: "purple", direction: "0",  file: "purplenorth_in"
  },
  {
    route_name: "purple", direction: "1",  file: "purplenorth_out"
  }
]

// in - 0, out - 1