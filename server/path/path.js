
const blue_chalearm_path_in = require('./parted_blue_chalearm_in.json')
const blue_chalearm_path_out = require('./parted_blue_chalearm_out.json')
const purple_a_in = require('./purple_a_in.json')
const purple_a_out = require('./purple_a_out.json')
const purple_b_in = require('./purple_b_in.json')
const purple_b_out = require('./purple_b_out.json')



exports.blue_chalearm_path_in  = blue_chalearm_path_in
exports.blue_chalearm_path_out = blue_chalearm_path_out
exports.purple_a_in = purple_a_in
exports.purple_a_out = purple_a_out
exports.purple_b_in = purple_b_in
exports.purple_b_out = purple_b_out


exports.config = [
  {
    route_name: "blue", direction: "0", speed: "1", file: "blue_chalearm_path_in"
  },
  {
    route_name: "blue", direction: "1", speed: "1", file: "blue_chalearm_path_out"
  },
  {
    route_name: "purple", direction: "0", speed: "1", file: "purple_a_in"
  },
  {
    route_name: "purple", direction: "1", speed: "1", file: "purple_a_out"
  },
  {
    route_name: "purple", direction: "0", speed: "2", file: "purple_b_in"
  },
  {
    route_name: "purple", direction: "1", speed: "2", file: "purple_b_out"
  },
]

