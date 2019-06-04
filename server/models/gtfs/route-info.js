const mongoose = require('mongoose');

const RouteInfoSchema = new mongoose.Schema({

  agency_key: {
    type: String,
    required: true,
    index: true
  },
  route_name: {
    type: String,
    required: true,
    index: true
  },
  trip_id: {
    type: String,
    required: true
  },
  start_point: {
    type: String,
    required: true
  },
  start_time: {
    type: String,
    required: true,
    index: true
  },
  end_point: {
    type: String,
    required: true,
    index: true
  },
  end_time: {
    type: String,
    required: true,
    index: true
  },
  length: {
    type: String,
    required: true,
    index: true
  },
  runtime: {
    type: String,
    index: true
  },
  direction: {
    type: String,
    index: true
  }
})

const RouteInfo = mongoose.model('RouteInfo', RouteInfoSchema);

module.exports = RouteInfo;
