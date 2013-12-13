#
rm -rf public/vendor

mkdir public/vendor
pushd public/vendor
curl -O https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular.min.js
curl -O https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular-route.min.js
curl -O https://ajax.googleapis.com/ajax/libs/angularjs/1.2.4/angular-resource.min.js
curl -O https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
cat angular.min.js angular-resource.min.js angular-route.min.js jquery.min.js > vendor_bundle.js
popd