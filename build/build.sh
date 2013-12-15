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

# compile javascript
uglifyjs js/LoadingCtrl.js   \
         js/ZueProject.js    \
         js/ZueCtrl.js       \
         js/AssociateCtrl.js \
         js/LightCtrl.js     \
         js/IdentifyCtrl.js  \
         \
         -b -o out/js/zue.js

# copy directory to public
rm -rf ../public/css
rm -rf ../public/js
cp -R out/css ../public
cp -R out/js ../public
rm -rf out

tput setaf 1
echo " ** Built"
tput sgr0
