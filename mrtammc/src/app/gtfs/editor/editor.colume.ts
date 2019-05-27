export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_id', field: 'agencyId', suppressAutoSize: false},
            {headerName: 'agency_name', field: 'agencyName'},
            {headerName: 'agency_url', field: 'agencyUrl'},
            {headerName: 'agency_timezone', field: 'agencyTimezone'},
            {headerName: 'agency_lang', field: 'agencyLang'},
            {headerName: 'agency_phone', field: 'agencyPhone'},
            {headerName: 'agency_fare_url', field: 'agencyFareUrl'},
            {headerName: 'agency_email', field: 'agencyEmail'}
        ],
        stops: [
            {headerName: 'stop_id', field: 'stopId'},
            {headerName: 'stop_code', field: 'stopCode'},
            {headerName: 'stop_name', field: 'stopName'},
            {headerName: 'stop_desc', field: 'stopDesc'},
            {headerName: 'stop_lat', field: 'stopLat'},
            {headerName: 'stop_lon', field: 'stopLon'},
            {headerName: 'stop_distance', field: 'stopDistance'},
            {headerName: 'zone_id', field: 'zoneId'},
            {headerName: 'stop_url', field: 'stopUrl'},
            {headerName: 'location_type', field: 'locationType'},
            {headerName: 'parent_station', field: 'parentStation'},
            {headerName: 'stop_timezone', field: 'stopTimezone'},
            {headerName: 'wheelchair_boarding', field: 'wheelchairBoarding'},
            {headerName: 'icon', field: 'icon'},
        ],
        routes: [
            {headerName: 'route_id', field: 'routeId'},
            {headerName: 'agency_id', field: 'agencyId'},
            {headerName: 'route_short_name', field: 'routeShortName'},
            {headerName: 'route_long_name', field: 'routeLongName'},
            {headerName: 'route_desc', field: 'routeDesc'},
            {headerName: 'route_type', field: 'routeType'},
            {headerName: 'route_url', field: 'routeUrl'},
            {headerName: 'route_color', field: 'routeColor'},
            {headerName: 'route_text_color', field: 'routeTextColor'},
            {headerName: 'route_sort_order', field: 'routeSortOrder'}
        ],
        trips: [
            {headerName: 'route_id', field: 'routeId'},
            {headerName: 'service_id', field: 'serviceId'},
            {headerName: 'trip_id', field: 'tripId'},
            {headerName: 'trip_headsign', field: 'tripHeadsign'},
            {headerName: 'trip_short_name', field: 'tripShortName'},
            {headerName: 'direction_id', field: 'directionId'},
            {headerName: 'block_id', field: 'blockId'},
            {headerName: 'shape_id', field: 'shapeId'},
            {headerName: 'wheelchair_accessible', field: 'wheelchairAccessible'},
            {headerName: 'bikes_allowed', field: 'bikesAllowed'}
        ],
        stop_times: [
            {headerName: 'trip_id', field: 'tripId'},
            {headerName: 'arrival_time', field: 'arrivalTime'},
            {headerName: 'departure_time', field: 'departureTime'},
            {headerName: 'stop_id', field: 'stopId'},
            {headerName: 'stop_sequence', field: 'stopSequence'},
            {headerName: 'stop_headsign', field: 'stopHeadsign'},
            {headerName: 'pickup_type', field: 'pickupType'},
            {headerName: 'drop_off_type', field: 'dropOffType'},
            {headerName: 'shape_dist_traveled', field: 'shapeDistTraveled'},
            {headerName: 'timepoint', field: 'timepoint'}
        ],
        calendar: [
            {headerName: 'service_id', field: 'serviceId'},
            {headerName: 'monday', field: 'Monday'},
            {headerName: 'tuesday', field: 'Tuesday'},
            {headerName: 'wednesday', field: 'Wednesday'},
            {headerName: 'thursday', field: 'Thursday'},
            {headerName: 'friday', field: 'Friday'},
            {headerName: 'saturday', field: 'Saturday'},
            {headerName: 'sunday', field: 'Sunday'},
            {headerName: 'start_date', field: 'startDate'},
            {headerName: 'end_date', field: 'endDate'}
        ],
        calendar_dates: [
            {headerName: 'service_id', field: 'service_id'},
            {headerName: 'date', field: 'date'},
            {headerName: 'exception_type', field: 'exception_type'}
        ],
        fare_attributes: [
            {headerName: 'fare_id', field: 'fare_id'},
            {headerName: 'price', field: 'price'},
            {headerName: 'currency_type', field: 'currency_type'},
            {headerName: 'payment_method', field: 'payment_method'},
            {headerName: 'transfers', field: 'transfers'},
            {headerName: 'agency_id', field: 'agency_id'},
            {headerName: 'transfer_duration', field: 'transfer_duration'}
        ],
        fare_rules: [
            {headerName: 'fare_id', field: 'fare_id'},
            {headerName: 'route_id', field: 'route_id'},
            {headerName: 'origin_id', field: 'origin_id'},
            {headerName: 'destination_id', field: 'destination_id'},
            {headerName: 'contains_id', field: 'contains_id'}
        ],
        shapes: [
            {headerName: 'shape_id', field: 'shape_id'},
            {headerName: 'shape_pt_lat', field: 'shape_pt_lat'},
            {headerName: 'shape_pt_lon', field: 'shape_pt_lon'},
            {headerName: 'shape_pt_sequence', field: 'shape_pt_sequence'},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled'}
        ],
        frequencies: [
            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'start_time', field: 'start_time'},
            {headerName: 'end_time', field: 'end_time'},
            {headerName: 'headway_secs', field: 'headway_secs'},
            {headerName: 'exact_times', field: 'exact_times'}
        ],
        transfers: [
            {headerName: 'from_stop_id', field: 'from_stop_id'},
            {headerName: 'to_stop_id', field: 'to_stop_id'},
            {headerName: 'transfer_type', field: 'transfer_type'},
            {headerName: 'min_transfer_time', field: 'min_transfer_time'}
        ],
        feed_info: [
            {headerName: 'feed_publisher_name', field: 'feed_publisher_name'},
            {headerName: 'feed_publisher_url', field: 'feed_publisher_url'},
            {headerName: 'feed_lang', field: 'feed_lang'},
            {headerName: 'feed_start_date', field: 'feed_start_date'},
            {headerName: 'feed_end_date', field: 'feed_end_date'},
            {headerName: 'feed_version', field: 'feed_version'}
        ]
    };
}
