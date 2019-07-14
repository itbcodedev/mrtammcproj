// const blue_chalearm_path_in = require('./blue_chalearm_path_in.json')
// const blue_chalearm_path_out = require('./blue_chalearm_path_out.json')
// const purpleline_path_in = require('./purpleline_path_in.json')
// const purpleline_path_out = require('./purpleline_path_out.json')
const blue_chalearm_path_in = require('./parted_blue_chalearm_in.json')
const blue_chalearm_path_out = require('./parted_blue_chalearm_out.json')
// const purpleline_path_in = require('./parted_purpleline_in.json')
// const purpleline_path_out = require('./parted_purpleline_out.json')



// const purpleline_path_in = require('./purple_600_in.json')
// const purpleline_path_out = require('./purple_600_out.json')

//const purpleline_path_in = require('./purple_930_in.json')
//const purpleline_path_out = require('./purple_930_out.json')



const moment = require('moment');

const currentTime= moment();

const purple_schdule = [
    {"start_time": "05:30", "end_time": "06:30", "path_in": "purple_930_in.json", "path_out": "purple_930_out.json"},
    {"start_time": "06:30", "end_time": "08:30", "path_in": "purple_600_in.json", "path_out": "purple_600_out.json"},
    {"start_time": "08:30", "end_time": "17:00", "path_in": "purple_930_in.json", "path_out": "purple_930_out.json"},
    {"start_time": "17:00", "end_time": "19:30", "path_in": "purple_600_in.json", "path_out": "purple_600_out.json"},
    {"start_time": "19:30", "end_time": "21:30", "path_in": "purple_930_in.json", "path_out": "purple_930_out.json"},
    {"start_time": "21:30", "end_time": "24:00", "path_in": "purple_930_in.json", "path_out": "purple_930_out.json"},
]

const purple =  purple_schdule.filter(e => {
    start_time = moment(e.start_time,"HH:mm")
    end_time = moment(e.end_time,"HH:mm")
    return currentTime.isBetween(start_time,end_time)
});


console.log(purple)
if (purple[0] != undefined) {
  const purpleline_path_in = require(`./${purple[0].path_in}`)
  const purpleline_path_out = require(`./${purple[0].path_out}`)
} else {
  const purpleline_path_in = require('./purple_930_in.json')
  const purpleline_path_out = require('./purple_930_out.json')
}


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

