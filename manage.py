#!/usr/bin/python

import argparse
import os
import logging
import subprocess
import re
from jinja2 import Template
logging.basicConfig(level=logging.DEBUG)

IGNORED = [
  r"^\./\.git",
  r"^\./packages",
  r".+\.py",
  r"^./vendors/fonts",
  r"^./index-template.html"
]

def get_all_script_paths(build=False):
  if build:
    return ["js/app.js"]
  else:
    scripts = ["js/develop/app.js"]
    for root, subdirs, files in os.walk("js/develop"):
      for fname in files:
        if fname.endswith(".js") and fname != "app.js":
          scripts.append(os.path.join(root, fname))

    return scripts

def build_js():
  js = get_all_script_paths(False)
  with open("js/app.js", "w") as f:
    f.write(subprocess.check_output(["uglifyjs"] + js + ["-m", "-c"]))

def build_template(template_vars):
  f = open("index-template.html", "r")
  template = Template(f.read(), variable_start_string="{[", variable_end_string="]}")
  f.close()
  f = open("index.html", "w")
  f.write(template.render(**template_vars))
  f.close()

def develop(args):
  pass


def build(args):
  logger = logging.getLogger("appbuilder")
  import zipfile
  from datetime import datetime

  if args.minified:
    IGNORED.append(r"^./js/develop")
  else:
    IGNORED.append(r"^./js/app.js")

  IGNORED_PATTERNS = []
  for i in xrange(len(IGNORED)):
    IGNORED_PATTERNS.append(re.compile(IGNORED[i]))

  # Builds JS
  if args.minified:
    logger.info("Minifying JS...")
    build_js()

  build_template({"scripts": get_all_script_paths(args.minified)})

  now = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
  zipname = "packages/package-{}.zip".format(now)

  fs = []
  for root, subdirs, files in os.walk("."):
    for fname in files:
      filename = os.path.join(root, fname)
      ignored = False
      for i, pattern in enumerate(IGNORED_PATTERNS):
        if pattern.match(filename):
          ignored = True
          logger.debug("File {} ignored for {}".format(filename, IGNORED[i]))
          break

      if ignored:
        continue

      fs.append(filename)

  with zipfile.ZipFile(zipname, "w") as z:
    for filename in fs:
      z.write(filename)


def server(args):
  import SocketServer
  from StringIO import StringIO
  from SimpleHTTPServer import SimpleHTTPRequestHandler

  if args.minified:
    build_js()

  template_vars = {
    "scripts": get_all_script_paths(args.minified)
  }

  # from http://hg.python.org/cpython/file/2.7/Lib/SimpleHTTPServer.py
  class PatchedHandler(SimpleHTTPRequestHandler):
    def send_head(self):
      path = self.translate_path(self.path)
      f = None
      if os.path.isdir(path):
        if not self.path.endswith('/'):
          self.send_response(301)
          self.send_header("Location", self.path + "/")
          self.end_headers()
          return None
        for index in ("index-template.html", ):
          index = os.path.join(path, index)
          if os.path.exists(index):
            path = index
            break
        else:
          return self.list_directory(path)
      ctype = self.guess_type(path)
      try:
        if path.endswith("index-template.html"):
          f = open(path, "r")
          template = Template(f.read(), variable_start_string="{[", variable_end_string="]}")
          f.close()
          f = StringIO(template.render(**template_vars))
        else:
          f = open(path, "rb")
      except IOError:
        self.send_error(404, "File not found")
        return None

      self.send_response(200)
      self.send_header("Content-type", ctype)
      if isinstance(f, StringIO):
        length = len(f.getvalue())
      else:
        length = os.fstat(f.fileno())[6]

      self.send_header("Content-Length", length)
      self.end_headers()
      return f

  PatchedHandler.extensions_map['.webapp'] = 'application/x-web-app-manifest+json'
  SocketServer.TCPServer.allow_reuse_address = True
  httpd = SocketServer.TCPServer((args.host, args.port), PatchedHandler)
  print "Starting server at http://%s:%d" % (args.host if args.host else "localhost", args.port)
  try:
    httpd.serve_forever()
  except KeyboardInterrupt:
    httpd.shutdown()

dispatch = {
  "build": build,
  "server": server,
}

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description="Test and builds a Firefox OS app.")
  parser.add_argument("command", help="A command to be dispatched. Available ones are: {0}".format(", ".join(dispatch.keys())))
  parser.add_argument("-o", "--host", help="Host to bind to for test server. Ignored for build.", default="")
  parser.add_argument("-p", "--port", help="Port to bind to for test server. Ignored for build.", type=int, default=3000)
  parser.add_argument("-c", "--config", help="Path to build configurations.", default="config.json")
  parser.add_argument("-m", "--minified", help="Use minified JS to run the test server.", action="store_true")
  args = parser.parse_args()

  dispatch[args.command](args)