echo 'Building js/less';
# move into build directory, if not already in it
# this will allow us to build from either zue or zue/build
cd build

# set up directories
rm -rf out
mkdir out
mkdir out/css
mkdir out/js

# compile less
lessc less/layout.less out/layout.css
lessc less/mix-ins.less out/mix-ins.css
lessc less/dashboard.less out/dashboard.css
cat out/layout.css out/mix-ins.css out/dashboard.css > out/css/zue.css
rm out/layout.css out/mix-ins.css out/dashboard.css

echo '[**   ]';

# compile javascript
uglifyjs js/controllers/LoadingCtrl.js   \
         js/controllers/ZueCtrl.js       \
         js/controllers/AssociateCtrl.js \
         js/controllers/LightCtrl.js     \
         js/controllers/IdentifyCtrl.js  \
         js/controllers/ReadCtrl.js      \
         js/controllers/PaletteCtrl.js   \
         js/app.js \
         js/directives/StopEvent.js \
         js/directives/Palette.js \
         js/directives/Spinner.js \
         \
         -b -o out/js/zue.js
         
echo '[**** ]';

# copy directory to public
rm -rf ../css
rm -rf ../js
cp -R out/css ..
cp -R out/js ..
rm -rf out

echo '[*****]';

echo " ++ Built"

