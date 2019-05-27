export class GtfsEditor {
    constructor () {}
    GTFS_COLUMNDEFS = {
        agency: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'agency_id', field: 'agency_id', editable: true},
            {headerName: 'agency_name', field: 'agency_name', editable: true},

            {headerName: 'agency_url', field: 'agency_url', editable: true},
            {headerName: 'agency_timezone', field: 'agency_timezone', editable: true},
            {headerName: 'agency_lang', field: 'agency_lang', editable: true},

            {headerName: 'agency_phone', field: 'agency_phone', editable: true},
            {headerName: 'agency_fare_url', field: 'agency_fare_url', editable: true},
            {headerName: 'agency_email', field: 'agency_email', editable: true},

            {headerName: 'agency_bounds', field: 'agency_bounds', editable: true},
            {headerName: 'agency_center', field: 'agency_bounds', editable: true}
        ],

        routes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'agency_id', field: 'agency_id', editable: true},
            {headerName: 'route_id', field: 'route_id', editable: true},

            {headerName: 'route_short_name', field: 'route_short_name', editable: true},
            {headerName: 'route_long_name', field: 'route_long_name', editable: true},
            {headerName: 'route_desc', field: 'route_desc', editable: true},

            {headerName: 'route_type', field: 'route_type', editable: true},
            {headerName: 'route_url', field: 'route_url', editable: true},
            {headerName: 'route_color', field: 'route_color', editable: true},
            {headerName: 'route_text_color', field: 'route_text_color', editable: true}
        ],

        trips: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'route_id', field: 'route_id', editable: true},
            {headerName: 'service_id', field: 'service_id', editable: true},

            {headerName: 'trip_id', field: 'trip_id'},
            {headerName: 'trip_headsign', field: 'trip_headsign', editable: true},
            {headerName: 'trip_short_name', field: 'trip_short_name', editable: true},

            {headerName: 'direction_id', field: 'direction_id', editable: true},
            {headerName: 'block_id', field: 'block_id', editable: true},
            {headerName: 'shape_id', field: 'shape_id', editable: true},

            {headerName: 'wheelchair_accessible', field: 'wheelchair_accessible', editable: true},
            {headerName: 'bikes_allowed', field: 'bikes_allowed', editable: true}
        ],

        stops: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'stop_id', field: 'stop_id', editable: true},
            {headerName: 'stop_code', field: 'stop_code', editable: true},

            {headerName: 'stop_name', field: 'stopName', editable: true},
            {headerName: 'stop_desc', field: 'stopDesc', editable: true},
            {headerName: 'stop_lat', field: 'stopLat', editable: true},

            {headerName: 'stop_lon', field: 'stopLon', editable: true},
            {headerName: 'zone_id', field: 'zone_id', editable: true},
            {headerName: 'stop_url', field: 'stop_url', editable: true},

            {headerName: 'location_type', field: 'location_type', editable: true},
            {headerName: 'parent_station', field: 'parent_station', editable: true},
            {headerName: 'stop_timezone', field: 'stop_timezone', editable: true},

            {headerName: 'wheelchair_boarding', field: 'wheelchair_boarding', editable: true},
            {headerName: 'level_id', field: 'level_id', editable: true},
            {headerName: 'platform_code', field: 'platform_code'},
        ],


        stop_times: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'trip_id', field: 'trip_id', editable: true},
            {headerName: 'arrival_time', field: 'arrival_time', editable: true},
            {headerName: 'departure_time', field: 'departure_time', editable: true},
            {headerName: 'stop_id', field: 'stop_id', editable: true},
            {headerName: 'stop_sequence', field: 'stop_sequence', editable: true},
            {headerName: 'stop_headsign', field: 'stop_headsign', editable: true},
            {headerName: 'pickup_type', field: 'pickup_type', editable: true},
            {headerName: 'drop_off_type', field: 'drop_off_type', editable: true},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true},
            {headerName: 'timepoint', field: 'timepoint', editable: true}
        ],

        calendars: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'service_id', field: 'service_id', editable: true},
            {headerName: 'monday', field: 'monday', editable: true},

            {headerName: 'tuesday', field: 'tuesday', editable: true},
            {headerName: 'wednesday', field: 'wednesday', editable: true},
            {headerName: 'thursday', field: 'thursday', editable: true},

            {headerName: 'friday', field: 'friday', editable: true},
            {headerName: 'saturday', field: 'saturday', editable: true},
            {headerName: 'sunday', field: 'sunday', editable: true},

            {headerName: 'start_date', field: 'start_date', editable: true},
            {headerName: 'end_date', field: 'end_date', editable: true}
        ],

        calendar_dates: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'service_id', field: 'service_id', editable: true},
            {headerName: 'date', field: 'date', editable: true},
            {headerName: 'exception_type', field: 'exception_type', editable: true}
        ],

        fare_attributes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'agency_id', field: 'agency_id', editable: true},
            {headerName: 'fare_id', field: 'fare_id', editable: true},

            {headerName: 'price', field: 'price', editable: true},
            {headerName: 'currency_type', field: 'currency_type', editable: true},
            {headerName: 'payment_method', field: 'payment_method', editable: true},

            {headerName: 'transfers', field: 'transfers', editable: true},
            {headerName: 'transfer_duration', field: 'transfer_duration', editable: true}
        ],
        fare_rules: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'fare_id', field: 'fare_id', editable: true},
            {headerName: 'route_id', field: 'route_id', editable: true},
            {headerName: 'origin_id', field: 'origin_id', editable: true},
            {headerName: 'destination_id', field: 'destination_id', editable: true},
            {headerName: 'contains_id', field: 'contains_id', editable: true}
        ],
        shapes: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'shape_id', field: 'shape_id', editable: true},
            {headerName: 'shape_pt_lat', field: 'shape_pt_lat', editable: true},

            {headerName: 'shape_pt_lon', field: 'shape_pt_lon', editable: true},
            {headerName: 'shape_pt_sequence', field: 'shape_pt_sequence', editable: true},
            {headerName: 'shape_dist_traveled', field: 'shape_dist_traveled', editable: true}
        ],
        // shape_details: [
        //   {headerName: 'agency_key', field: 'agency_key', editable: true},
        //   {headerName: 'color', field: 'color', editable: true},
        //   {headerName: 'shape_id', field: 'shapeId', editable: true},
        //   {headerName: 'shape_long_name', field: 'shapeLongName', editable: true},
        //   {headerName: 'shape_short_name', field: 'shapeShortName', editable: true}
        // ],
        // periods: [
        //   {headerName: 'agency_key', field: 'agency_key', editable: true},
        //   {headerName: 'Period', field: 'Period', editable: true},
        //   {headerName: 'calendar_id', field: 'calendarId', editable: true},
        //   {headerName: 'endTime', field: 'endTime', editable: true},
        //   {headerName: 'frequency', field: 'frequency', editable: true},
        //   {headerName: 'num_trains', field: 'numTrains', editable: true},
        //   {headerName: 'start_time', field: 'startTime', editable: true}
        // ],
        pathways: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'pathway_id', field: 'pathway_id', editable: true},
            {headerName: 'from_stop_id', field: 'from_stop_id', editable: true},

            {headerName: 'to_stop_id', field: 'to_stop_id', editable: true},
            {headerName: 'pathway_mode', field: 'pathway_mode', editable: true},
            {headerName: 'is_bidirectional', field: 'is_bidirectional', editable: true}
        ],
        frequencies: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'trip_id', field: 'trip_id', editable: true},
            {headerName: 'start_time', field: 'start_time', editable: true},

            {headerName: 'end_time', field: 'end_time', editable: true},
            {headerName: 'headway_secs', field: 'headway_secs', editable: true},
            {headerName: 'exact_times', field: 'exact_times', editable: true}
        ],
        transfers: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'from_stop_id', field: 'from_stop_id', editable: true},
            {headerName: 'to_stop_id', field: 'to_stop_id', editable: true},

            {headerName: 'transfer_type', field: 'transfer_type', editable: true},
            {headerName: 'min_transfer_time', field: 'min_transfer_time', editable: true}
        ],
        levels: [
            {headerName: 'agency_key', field: 'agency_key', editable: true},
            {headerName: 'level_id', field: 'level_id', editable: true},
            {headerName: 'level_index', field: 'level_index', editable: true},

            {headerName: 'level_name', field: 'level_name', editable: true}
        ]
        // feed_info: [
        //     {headerName: 'agency_key', field: 'agency_key', editable: true},
        //     {headerName: 'feed_publisher_name', field: 'feed_publisher_name', editable: true},
        //     {headerName: 'feed_publisher_url', field: 'feed_publisher_url', editable: true},
        //     {headerName: 'feed_lang', field: 'feed_lang', editable: true},
        //     {headerName: 'feed_start_date', field: 'feed_start_date', editable: true},
        //     {headerName: 'feed_end_date', field: 'feed_end_date', editable: true},
        //     {headerName: 'feed_version', field: 'feed_version', editable: true}
        // ]
    };
}
