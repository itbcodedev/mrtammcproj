const {init, DATABASE} = require('./initdb_route_infos');
const main = async () => {
  const result = await init()
  if (result) {
    console.log('Success initial database');
    console.log('Please Press Ctrl+c, to finish');
  } else {
    console.log('Unexpect error');
  }
  
}
main();

