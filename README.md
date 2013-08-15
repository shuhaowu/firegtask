Google Task for Firefox OS
==========================

Google Task on Firefox OS. Also a demonstration app for Firefox OS built with
AngularJS. A packaged app, too!

Running
-------

To run this app for local development, you need to install jinja2 and uglifyjs.

You need to go into js/ and copy settings.js-dist to settings.js and fill
it with your own API keys and such.

Then, simply do

    $ ./manage.py server

Head over to http://localhost:3000 to checkout the page.

To build the packaged app:

    $ ./manage.py build

That will build the app to packages/package-*.zip

To see more info, do 

    $ ./manage.py --help
