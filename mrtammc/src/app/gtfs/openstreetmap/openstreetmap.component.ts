import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { GtfsService } from '../../services/gtfs.service';

declare let L;


import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-openstreetmap',
  templateUrl: './openstreetmap.component.html',
  styleUrls: ['./openstreetmap.component.scss']
})

export class OpenstreetmapComponent implements OnInit {
  map: any;
  activeTrains: any;
  purplestations = [
    {
      'station': 'คลองบางไผ่',
      'code': 'PP01',
      'distance': 0,
      'location': [50.05, 730.6]
    },
    {
      'station': 'ตลาดบางใหญ่',
      'code': 'PP02',
      'distance': 1.26,
      'location': [50.05, 713.94]
    },
    {
      'station': 'สามแยกบางใหญ่',
      'code': 'PP03',
      'distance': 2.94,
      'location': [60.93, 697.94]
    },
    {
      'station': 'บางพูล',
      'code': 'PP04',
      'distance': 4.50,
      'location': [86.8, 697.94]
    },
    {
      'station': 'บางรักใหญ่',
      'code': 'PP05',
      'distance': 5.69,
      'location': [112.07, 697.94]
    },
    {
      'station': 'ท่าอิฐ',
      'code': 'PP06',
      'distance': 6.97,
      'location': [138.44, 697.94]
    },
    {
      'station': 'ไทรม้า',
      'code': 'PP07',
      'distance': 8.20,
      'location': [164.07, 697.94]
    },
    {
      'station': 'สะพานพระนั่งเกล้า',
      'code': 'PP08',
      'distance': 9.68,
      'location': [192.43, 697.94]
    },
    {
      'station': 'แยกนนทบุรี 1',
      'code': 'PP09',
      'distance': 11.3,
      'location': [221.82, 697.94]
    },
    {
      'station': 'ศรีพรสวรรค์',
      'code': 'PP10',
      'distance': 12.5,
      'location': [249.01, 697.94]
    },
    {
      'station': 'ศูนย์ราชการนนทบุรี',
      'code': 'PP11',
      'distance': 13.5,
      'location': [275.75, 697.94]
    },
    {
      'station': 'กระทรวงสาธารณสุข',
      'code': 'PP12',
      'distance': 15.5,
      'location': [329.24, 663.61]
    },
    {
      'station': 'แยกติวานนท์',
      'code': 'PP13',
      'distance': 16.9,
      'location': [349.13, 644.13]
    },
    {
      'station': 'แยกวงค์สว่าง',
      'code': 'PP14',
      'distance': 18.5,
      'location': [356.97, 619.88]
    },
    {
      'station': 'บางซ่อน',
      'code': 'PP15',
      'distance': 19.9,
      'location': [356.97, 591.64]
    },
    {
      'station': 'เตาปูน',
      'code': 'PP16',
      'distance': 21.5,
      'location': [356.97, 562.77]
    },

  ];
  purple_points = [];
  blue_points = [];
  group1;
  myTrains;
  notfollow = true;

  constructor(@Inject(DOCUMENT) private document,
    private renderer: Renderer2,
    private gtfsService: GtfsService) { }


  ngOnInit() {
    //this.renderer.removeClass(this.document.body, 'sidebar-open');
    //this.renderer.addClass(this.document.body, 'sidebar-collapse');

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      center: [650, 480],
      zoom: 1
    });

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //      }).addTo(map);
    //
    L.Icon.Default.imagePath = './assets/leaflet/images/';

    const lefttrain = L.icon({
      iconUrl: './assets/leaflet/images/left-train.svg',
      iconSize: [28, 25],
      iconAnchor: [14, 14],
      popupAnchor: [-3, -10]
    });
    const righttrain = L.icon({
      iconUrl: './assets/leaflet/images/right-train.svg',
      iconSize: [28, 25],
      iconAnchor: [14, 14],
      popupAnchor: [-3, -10]
    });

    const tubemap = './assets/dist/img/mrtatube.svg';
    const bounds = [[0, 0], [955, 962]];

    L.imageOverlay(tubemap, bounds).addTo(this.map).bringToBack();
    // const point = L.circle([730.6, 50], { color: 'green', radius: 4 }).addTo(map);

    const purple = [[50.05, 730.07], [50.05, 697.77], [294.05, 697.77], [357.04, 636.27], [357.04, 566.83]];
    const blue = [[357.04, 563.27], [479.55, 563.27], [479.55, 616.77], [533.86, 616.77], [598.86, 551.26], [598.86, 361.90], [421.20, 361.90]]

    this.getPosition(purple).forEach(position => {
      const marker = L.marker([position[1], position[0]], { icon: lefttrain });
      this.purple_points.push(marker);

    });

    this.getPosition(blue).forEach(position => {
      this.blue_points.push(L.circle([position[1], position[0]], { color: 'green', radius: 3 }));
    });

    this.group1 = L.featureGroup();
    this.group1.addTo(this.map);

    setInterval(async () => {
      // find  active train
      this.activeTrains = await this.promise_getTrain(this.timeToMidnight());

      // select view
      if (this.notfollow == true) {
        this.myTrains = await this.moveTrain(this.timeToMidnight());
        // console.log(this.myTrains);
      } else {
        //await this.singletrip(this.timeToMidnight())
      }


    }, 5000);

  }



  timeToMidnight() {
    const time = new Date();
    const secs = +time.getHours() * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    //const secs = 20 * 3600 + +time.getMinutes() * 60 + +time.getSeconds();
    return secs;
  }

  async promise_getTrain(secs: number) {
    return new Promise(async (resolve, reject) => {
      const stopslists = await this.gtfsService.getstopwithroutes();

      let stationA: any;
      let stationB: any;
      for (let i = 0; i < stopslists.length; i++) {
        //console.log(`${stopslists[i].route}  routename ${stopslists[i].routename} `);
        const stops = stopslists[i].stops;
        if (stops.length > 0) {
          stationA = stops[0].stopid;      //first station
          stationB = stops[stops.length - 1].stopid; // last station
        }

      }
      const activeTrains = [];
      // get data from api
      const trips = await this.gtfsService.getTrips().then((trip) => trip);
      const stop_times = await this.gtfsService.getStopTimes().then((stop_time => stop_time));
      //console.log('560 -----', stop_times.length)
      const grouped = this.groupBy(stop_times, stop => stop.tripId);

      grouped.forEach((values, key) => {
        //console.log('565--------',key, values.length, values);
        const selectedTrain = [];
        const selectTrips = [];
        const trains = [];

        for (const trip of values) {
          //if (trip.stopId === stationA || trip.stopId === stationB) {
          selectTrips.push(trip);
          //}
        }

        //console.log('575--------',key, selectTrips.length, selectTrips);
        // create train info object
        if (selectTrips !== undefined) {
          for (let i = 0; i < selectTrips.length; i += 2) {
            if ((selectTrips[i + 1])) {
              const trip_tripid = trips.find(trip => trip.tripId === selectTrips[i].tripId);

              if (trip_tripid !== undefined) {

                const shape = trip_tripid.shapeId;
                const object = Object.assign({}, {
                  stop_idA: `${selectTrips[i].stopId}`,
                  stop_idB: `${selectTrips[i + 1].stopId}`,
                  trip_id: `${selectTrips[i].tripId}`,
                  shape_id: `${shape}`,
                  direction_id: `${trip_tripid.directionId}`,
                  arrival_secs: `${selectTrips[i].arrivalSecs}`,
                  departure_secs: `${selectTrips[i + 1].departureSecs}`,
                  arrival_time: `${selectTrips[i].arrivalTime}`,
                  departure_time: `${selectTrips[i + 1].departureTime}`
                });
                trains.push(object);  // get train
              } else {

              }
            }
          }
        } else {
          console.log("")
        }

        const isActiveTrain = (t: any) => {    // test train
          if ((secs >= t.arrival_secs) && (secs < t.departure_secs)) {
            return true;
          } else {
            return false;
          }
        };
        //console.log('611 ---- trains.length', trains.length)
        for (let i = 0; i < trains.length; i++) {
          if (isActiveTrain(trains[i])) {
            if (trains[i]) {
              activeTrains.push(trains[i]);
            }
          }
        }
        resolve(activeTrains);
      });
    });
  }


  getPosition(arr) {
    const result = []
    function pairwise(arr, func) {
      for (var i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1])
      }
    }

    pairwise(arr, function(current, next) {
      // initialize
      let x0 = current[0];
      let y0 = current[1];
      let x1 = next[0];
      let y1 = next[1];
      // along x
      if (x1 == x0) {
        if (y1 < y0) {
          while (y0 >= y1) {
            const position = y0--;
            result.push([x1, position]);
          }
        } else {
          while (y0 <= y1) {
            const position = y0++;
            result.push([x1, position]);
          }
        }
      }
      // along y
      if (y1 == y0) {
        if (x1 < x0) {
          while (x0 >= x1) {
            const position = x0--;
            result.push([position, y1]);
          }
        } else {
          while (x0 <= x1) {
            const position = x0++;
            result.push([position, y1]);
          }
        }

      }
      //
      if ((x1 != x0) && (y1 != y0)) {
        while (x0 <= x1) {
          const position_x = x0++;
          const position_y = y0--;
          result.push([position_x, position_y]);
        }
      }

    })
    return result;
  }

  async moveTrain(secs: number) {
    this.group1.clearLayers();
    const trains = this.activeTrains;
    console.log(trains);
    const markers = [];
    for (let i = 0; i < trains.length; i++) {
      trains[i].density = Math.floor((Math.random() * 10) + 1);
      const totallength = this.purple_points.length;
      console.log(`totallength  ${totallength}`);
      const total_diff_time = trains[i].departure_secs - trains[i].arrival_secs;

      // 0 = inbound  diff from station A, 1 = outbound diff from station B
      const direction = trains[i].direction_id;
      let diff_time = 0;
      let diff_distance = 0;
      if (direction == true) {  // outbound
        diff_time = trains[i].departure_secs - secs;
        console.log(`diff_time ${diff_time}`);
        console.log(`total_diff_time ${total_diff_time}`);
        diff_distance = (totallength * diff_time) / total_diff_time;
      }
      if (direction == false) { // inbound
        diff_time = secs - trains[i].arrival_secs;
        console.log(`diff_time ${diff_time}`);
        console.log(`total_diff_time ${total_diff_time}`);
        diff_distance = (totallength * diff_time) / total_diff_time;
      }
      console.log(`diff_distance ${diff_distance}`);
      const start_x = Math.round(diff_distance);
      console.log(`start_x ${start_x}`);
      let trip_direction = direction ? 'ขบวนขาออก' : 'ขบวนขาเข้า';
      let density = "";
      for (let j = 0; j < trains[i].density; j++) {
        density += '<span ><img src="assets/dist/icons/man.png" /></span>';
      }
      let markerLabel = trains[i].trip_id;

      if (direction == true) {
        trains[i].heading = 'left';
      }
      if (direction == false) {
        trains[i].heading = 'right';
      }
      const contentmarker = `
       <div class="info-window">
          <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-train fa-stack-1x fa-inverse"></i>
          </span>
          <span class="badge badge-danger"> ${markerLabel}</span><span> ทิศทาง ${trip_direction}</span>
          <p> เส้นทาง ${trains[i].stop_idA} - ${trains[i].stop_idB} </p>
          <div class="alert alert-light">
              <p> <b> ความหนาแน่น ${trains[i].density * 10} % </b> </p>
              ${density}
          </div>

        </div>
       `;
      const lefttrain = L.icon({
        iconUrl: './assets/leaflet/images/left-train.png',
        iconSize: [28, 25],
        iconAnchor: [14, 14],
        popupAnchor: [-3, -10]
      });
      const righttrain = L.icon({
        iconUrl: './assets/leaflet/images/right-train.png',
        iconSize: [28, 25],
        iconAnchor: [14, 14],
        popupAnchor: [-3, -10]
      });
      if (direction == true) {
        this.purple_points[start_x].setIcon(lefttrain);
      }
      if (direction == false) {
        this.purple_points[start_x].setIcon(righttrain);
      }

      this.purple_points[start_x].addTo(this.group1)
        .bindPopup(contentmarker)
        .bindTooltip(markerLabel, {
          permanent: true,
          direction: 'top',
          className: 'tooltipclass'
        });

    }

  }

  groupBy(list, keyGetter) {
    const shapemap = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = shapemap.get(key);
      if (!collection) {
        shapemap.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return shapemap;
  }
}
