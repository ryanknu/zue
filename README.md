Requirements
==
node
nginx
npm lessc
npm uglify-js

Deploy
==
when you deploy, make sure you follow up with a build/build.sh to make the assets directory. Compiled assets are not committed to the repository. Also, don't forget to init.sh to create vendor files.

Nginx Proxy
==
This program is really only meant to be deployed to nginx with proxy parameters. Point nginx document root at the public folder, then start the node server on port 9001. Obviously, all this changes depending on the release procedure you do.

# forward /api calls to the Hue Bridge
location ~ /api {
    proxy_pass http://10.0.1.27;
}

# forward app calls to node
location ~ /app {
    proxy_pass http://127.0.0.1:9001;
}
