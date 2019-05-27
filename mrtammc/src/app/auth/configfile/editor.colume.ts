export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_id', field: 'agencyId', editable: true},
            {headerName: 'agency_name', field: 'agencyName', editable: true},
            {headerName: 'agency_url', field: 'agencyUrl', editable: true},
            {headerName: 'agency_timezone', field: 'agencyTimezone', editable: true},
            {headerName: 'agency_lang', field: 'agencyLang', editable: true},
            {headerName: 'agency_phone', field: 'agencyPhone', editable: true},
            {headerName: 'agency_fare_url', field: 'agencyFareUrl', editable: true},
            {headerName: 'agency_email', field: 'agencyEmail', editable: true}
        ],
        stops: [
            {headerName: 'stop_id', field: 'stopId', editable: true},
            {headerName: 'stop_code', field: 'stopCode', editable: true},
            {headerName: 'stop_name', field: 'stopName', editable: true},
            {headerName: 'stop_desc', field: 'stopDesc', editable: true},
            {headerName: 'stop_lat', field: 'stopLat', editable: true},
            {headerName: 'stop_lon', field: 'stopLon', editable: true},
            {headerName: 'stop_distance', field: 'stopDistance', editable: true},
            {headerName: 'zone_id', field: 'zoneId', editable: true},
            {headerName: 'stop_url', field: 'stopUrl', editable: true},
            {headerName: 'location_type', field: 'locationType', editable: true},
            {headerName: 'parent_station', field: 'parentStation', editable: true},
            {headerName: 'stop_timezone', field: 'stopTimezone', editable: true},
            {headerName: 'wheelchair_boarding', field: 'wheelchairBoarding', editable: true},
            {headerName: 'icon', field: 'icon'},
        ],
        routes: [
            {headerName: 'route_id', field: 'routeId', editable: true},
            {headerName: 'agency_id', field: 'agencyId', editable: true},
            {headerName: 'route_short_name', field: 'routeShortName', editable: true},
            {headerName: 'route_long_name', field: 'routeLongName', editable: true},
            {headerName: 'route_desc', field: 'routeDesc', editable: true},
            {headerName: 'route_type', field: 'routeType', editable: true},
            {headerName: 'route_url', field: 'routeUrl', editable: true},
            {headerName: 'route_color', field: 'routeColor', editable: true},
            {headerName: 'route_text_color', field: 'routeTextColor', editable: true},
            {headerName: 'route_sort_order', field: 'routeSortOrder', editable: true}
        ],
        trips: [
            {headerName: 'route_id', field: 'routeId', editable: true},
            {headerName: 'service_id', field: 'serviceId', editable: true},
            {headerName: 'trip_id', field: 'tripId'},
            {headerName: 'trip_headsign', field: 'tripHeadsign', editable: true},
            {headerName: 'trip_short_name', field: 'tripShortName', editable: true},
            {headerName: 'direction_id', field: 'directionId', editable: true},
            {headerName: 'block_id', field: 'blockId', editable: true},
            {headerName: 'shape_id', field: 'shapeId', editable: true},
            {headerName: 'wheelchair_accessible', field: 'wheelchairAccessible', editable: true},
            {headerName: 'bikes_allowed', field: 'bikesAllowed', editable: true}
        ],
        stop_times: [
            {headerName: 'trip_id', field: 'tripId', editable: true},
            {headerName: 'arrival_time', field: 'arrivalTime', editable: true},
            {headerName: 'departure_time', field: 'departureTime', editable: true},
            {headerName: 'stop_id', field: 'stopId', editable: true},
            {headerName: 'stop_sequence', field: 'stopSequence', editable: true},
            {headerName: 'stop_headsign', field: 'stopHeadsign', editable: true},
            {headerName: 'pickup_type', field: 'pickupType', editable: true},
            {headerName: 'drop_off_type', field: 'dropOffType', editable: true},
            {headerName: 'shape_dist_traveled', field: 'shapeDistTraveled', editable: true},
            {headerName: 'timepoint', field: 'timepoint', editable: true}
        ],
        calendar: [
            {headerName: 'service_id', field: 'serviceId', editable: true},
            {headerName: 'monday', field: 'Monday', editable: true},
            {headerName: 'tuesday', field: 'Tuesday', editable: true},
            {headerName: 'wednesday', field: 'Wednesday', editable: true},
            {headerName: 'thursday', field: 'Thursday', editable: true},
            {headerName: 'friday', field: 'Friday', editable: true},
            {headerName: 'saturday', field: 'Saturday', editable: true},
            {headerName: 'sunday', field: 'Sunday', editable: true},
            {headerName: 'start_date', field: 'startDate', editable: true},
            {headerName: 'end_date', field: 'endDate', editable: true}
        ],
        calendar_dates: [
            {headerName: 'service_id', field: 'service_id', editable: true},
            {headerName: 'date', field: 'date', editable: true},
            {headerName: 'exception_type', field: 'exception_type', editable: true}
        ],
        fare_attributes: [
            {headerName: 'fare_id', field: 'fareId', editable: true},
            {headerName: 'price', field: 'price', editable: true},
            {headerName: 'currency_type', field: 'currencyType', editable: true},
            {headerName: 'payment_method', field: 'paymentMethod', editable: true},
            {headerName: 'transfers', field: 'transfers', editable: true},
            {headerName: 'agency_id', field: 'agencyId', editable: true},
            {headerName: 'transfer_duration', field: 'transferDuration', editable: true}
        ],
        fare_rules: [
            {headerName: 'fare_id', field: 'fareId', editable: true},
            {headerName: 'route_id', field: 'routeId', editable: true},
            {headerName: 'origin_id', field: 'originId', editable: true},
            {headerName: 'destination_id', field: 'destinationId', editable: true},
            {headerName: 'contains_id', field: 'containsId', editable: true}
        ],
        shapes: [
            {headerName: 'shape_id', field: 'shapeId', editable: true},
            {headerName: 'shape_pt_lat', field: 'shapePtLat', editable: true},
            {headerName: 'shape_pt_lon', field: 'shapePtLon', editable: true},
            {headerName: 'shape_pt_sequence', field: 'shapePtSequence', editable: true},
            {headerName: 'shape_dist_traveled', field: 'shapeDistTraveled', editable: true}
        ],
        shape_details: [
          {headerName: 'color', field: 'color', editable: true},
          {headerName: 'shape_id', field: 'shapeId', editable: true},
          {headerName: 'shape_long_name', field: 'shapeLongName', editable: true},
          {headerName: 'shape_short_name', field: 'shapeShortName', editable: true}
        ],
        periods: [
          {headerName: 'Period', field: 'Period', editable: true},
          {headerName: 'calendar_id', field: 'calendarId', editable: true},
          {headerName: 'endTime', field: 'endTime', editable: true},
          {headerName: 'frequency', field: 'frequency', editable: true},
          {headerName: 'num_trains', field: 'numTrains', editable: true},
          {headerName: 'start_time', field: 'startTime', editable: true}
        ],
        frequencies: [
            {headerName: 'trip_id', field: 'tripId', editable: true},
            {headerName: 'start_time', field: 'startTime', editable: true},
            {headerName: 'end_time', field: 'endTime', editable: true},
            {headerName: 'headway_secs', field: 'headwaySecs', editable: true},
            {headerName: 'exact_times', field: 'exactTimes', editable: true}
        ],
        transfers: [
            {headerName: 'from_stop_id', field: 'fromStopId', editable: true},
            {headerName: 'to_stop_id', field: 'toStopId', editable: true},
            {headerName: 'transfer_type', field: 'transferType', editable: true},
            {headerName: 'min_transfer_time', field: 'minTransferTime', editable: true}
        ],
        feed_info: [
            {headerName: 'feed_publisher_name', field: 'feed_publisher_name', editable: true},
            {headerName: 'feed_publisher_url', field: 'feed_publisher_url', editable: true},
            {headerName: 'feed_lang', field: 'feed_lang', editable: true},
            {headerName: 'feed_start_date', field: 'feed_start_date', editable: true},
            {headerName: 'feed_end_date', field: 'feed_end_date', editable: true},
            {headerName: 'feed_version', field: 'feed_version', editable: true}
        ]
    };
}
