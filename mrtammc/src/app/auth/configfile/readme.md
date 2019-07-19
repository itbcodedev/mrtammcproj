## 

  deployconfigfile(file: any) {
    // const filename = file.split("-")[1]
    this._uploadservice.deployconfigfile(file).subscribe(res => {
      console.log(res);
      this._toastr.success("Successfull upload file" + res);
    });
  }


    constructor(
    private _uploadservice: ConfigfileService,
    private _toastr: ToastrService,
    private _http: HttpClient,
    private fb: FormBuilder
  ) {


    import { ConfigfileService } from "../../services/configfile.service";



  deployconfigfile(filename: string) {
    console.log('deploy config file ->' + filename);
    return this._http.get(this.upload_url +'/deployconfig/' + filename);
  }



  upload_url = `${this.baseUrl}/configfile`;

  app.use('/configfile', configfile);


  const configfile = require('./routes/configfile.router');


  router.get("/deployconfig/:filename", (req, res) => {
  let filename = req.params.filename;
  let oldfile = "configfiles/" + filename;
  let targetfile = "feed/" + filename.split('-')[1];
  let backupfile = "backupfeed/" + filename.split('-')[1];

  // backup file first
  fs.rename(targetfile, backupfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Backup Success"
      });
    }
  });

  // copy note rename
  fs.copyFileSync(oldfile, targetfile, (err) => {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log(err);
      }
    } else {
      res.json({
        message: "Success Deploy"
      });
    }
  });
});
