const moment = require('moment');
const fetch = require('node-fetch');

exports.TrainSimulator = class {

  constructor (gtfs, route_id,path_config) {
    this.gtfs = gtfs
    this.route_id = route_id
    this.path_config = path_config

    const mmt = moment();
    const mmtMidnight = mmt.clone().startOf('day');
    const diffSeconds = mmt.diff(mmtMidnight, 'seconds');
    const routeinfo = this.trainAdvance(diffSeconds).then(result => result)
    console.log(routeinfo)
    const fileindex = this.getfileFromConfig(route_id,path_config)
    this.file = path_config[fileindex].filepath;

  }

  getfileFromConfig(route_id,config) {
    const index = config.findIndex((path,index) => {
      return path.route_id === route_id
    })
    return index
  }

  // class method as async
  async trainAdvance(now) {
    console.log('now is .. ', now)
    let routeinfos=[]
    try {
      const query = {}
      const routeinfos = await this.gtfs.getRouteInfo(query)
      //const routeinfos = await fetch('http://localhost:3000/api/v2/routeinfos')
      return routeinfos
    } catch (err) {
      console.log(err)
      return 0
    }
  }

  getTrainPositionAt(time) {

  }

  print() {
    console.log(this.file)
  }

}
