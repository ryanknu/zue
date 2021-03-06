#
rm -rf public/vendor

mkdir public/vendor
cd public/vendor
echo 'Fetching dependencies';
echo '[     ]';
curl -s -O https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular.min.js
curl -s -O https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular-route.min.js
echo '[**   ]';
curl -s -O https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
echo '[**** ]';
curl -s -O https://raw.github.com/Q42/hue-color-converter/master/colorconverter.js
echo '[*****]';
cat angular.min.js angular-route.min.js jquery.min.js colorconverter.js > vendor_bundle.js

cd ../../