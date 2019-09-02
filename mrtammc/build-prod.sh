#!/bin/bash

unlink /home/sawangpong/app/mrtammcproj/mrtammc/dist/mrtammc/assets/dist/public
ng build --prod

sudo systemctl restart mrta-app1 && sudo systemctl restart mrta-app2
