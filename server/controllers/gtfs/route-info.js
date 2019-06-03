const RouteInfo = require('../../models/gtfs/route-info');

/*
 * Returns an array of feed_info that match the query parameters.
 */
exports.getRouteInfo = (query = {}, projection = '-_id', options = {lean: true, timeout: true}) => {
  return RouteInfo.find(query, projection, options);
};
