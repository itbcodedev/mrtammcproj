const blue_chalearm_path_in = require('./blue_chalearm_path_in.json')
const blue_chalearm_path_out = require('./blue_chalearm_path_out.json')
const purpleline_path_in = require('./purpleline_path_in.json')
const purpleline_path_out = require('./purpleline_path_out.json')

exports.blue_chalearm_path_in  = blue_chalearm_path_in
exports.blue_chalearm_path_out = blue_chalearm_path_out
exports.purpleline_path_in = purpleline_path_in
exports.purpleline_path_out = purpleline_path_out

exports.config = [
  {
    route_name: "blue", direction: "0", file: "blue_chalearm_path_in"
  },
  {
    route_name: "blue", direction: "1", file: "blue_chalearm_path_out"
  },
  {
    route_name: "purple", direction: "0", file: "purpleline_path_in"
  },
  {
    route_name: "purple", direction: "1", file: "purpleline_path_out"
  },
]
