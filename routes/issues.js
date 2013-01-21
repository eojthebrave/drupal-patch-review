/**
 * @file
 */

var request = require('request')
  , jsdom = require('jsdom');

/**
 * GET /:issue
 */
exports.build = function(req, res) {
  // Make sure we've got a valid issue id.
  if (typeof req.params['issue'] != 'number') {
    // @todo: Error checking (invalid input).
  }

  var issue_id = req.params['issue'];
  console.log(req.params);

  jsdom.env({html: 'http://drupal.org/node/' + issue_id, scripts: ['http://code.jquery.com/jquery-1.6.min.js']}, function(errors, window) {
    if (errors) {
      // @todo: Error checking (could not get page from d.o.).
      res.send(false);
    }

    //Use jQuery just as in a regular HTML page.
    var $ = window.jQuery;
    // We need to find the issue's version number listed in the table at the
    // top of the page and confirm that it's Drupal 8.x-dev.
    if ($('#project-issue-summary-table td:eq(3)').html() == '8.x-dev') {
      // Find the last patch linked on the page.
      patch_href = $('div.comment div.content table a:last[href$=".patch"]').attr('href');
      res.send({
        issue_id: issue_id,
        title: $('h1').text(),
        patch: patch_href,
      });

      // Deploy a new environment on openshit.redhat.com.
      var env = new BuildEnv(issue_id, res);

    }
    else {
      // @todo: Error checking (bad version).
      res.send(false);
    }
  });
};

/**
 * Build a new environment on which Drupal can be installed and tested.
 *
 * @todo: This should be pluggable so you can use OpenShit, or EC2 or ... other.
 */
BuildEnv = function(name, res){
  this.name = name;
  env = this;

  var https = require('https');

  var options = {
    host: CONFIG.RHC_HOST,
    port: CONFIG.RHC_PORT,
    path: '/broker/rest/domains',
    method: 'POST',
  };

  // We need to calculate our authentication hash manually rather than just
  // letting the request library do it since the request library chokes on
  // usernames with special characters like '@' in it and OpenShift usernames
  // are generally our e-mail address.
  var auth = 'Basic ' + new Buffer(CONFIG.RHC_USER + ':' + CONFIG.RHC_PASS).toString('base64');

  var request = require('request');
  request.post('https://openshift.redhat.com/broker/rest/domains/joeshindelar/applications', {
      headers: {'Authorization': auth, 'Accept': 'application/json'},
      'form': {'name': name, 'cartridge': 'php-5.3', 'scale': false}
    },
    function(error, response, body) {
      var result = JSON.parse(response.body);
      // @todo: Verify the environment was built. Get the SSH URI out of the
      // results so we can use that in the setup phase.
      console.log(response.body);

      env.setup();
    }
  );
};

/**
 * Setup the new environment.
 *
 * This works by connecting to the env via ssh and running a command. Which in
 * turn grabs the appropriate drupal-patch-reivew-{ENV}-client library from
 * Github and runs the contained setup.sh script.
 */
BuildEnv.prototype.setup = function() {
  console.log('Run environment setup tasks.');
  // @todo: Make this actually do something.

  // Comand to run on a new environment after it's been setup.
  var ssh_command = 'cd app-root; git clone http://github.com/eojthebrave/drupal-patch-preview-client.git; /bin/bash drupal-patch-preview-client/setup.sh;';
};
