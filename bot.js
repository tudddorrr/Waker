var Twit = require('twit');
var _ = require('lodash');
var fs = require('fs');
var timeService = require('./services/time-service');
var log = require('./logger');

var T = new Twit({
    consumer_key: process.env.T_CONSUMER_KEY,
    consumer_secret: process.env.T_CONSUMER_SECRET,
    access_token: process.env.T_ACCESS_TOKEN,
    access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
    timeout_ms: 60000
});

exports.status = function (server) {
    // get the date
    var now = timeService.now();

    // get a random gif
    var b64content = chooseGif();
    
    // post the gif
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        var mediaIdStr = data.media_id_string;
        var meta_params = { media_id: mediaIdStr, alt_text: { text: 'Fire! Panic! Wake up! Servers down!' } };

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // post a status
                var status = server.name + ' is down, fix it! (' + now + ')';

                T.post('statuses/update', { status: '@sekaru_ @sleepystudios Hey, ' + status, media_ids: [mediaIdStr] }, function (err, data, response) {
                    if (err) {
                        log.error(_.first(err.allErrors).message + '\n');
                        return;
                    }

                    log.info('Posted status: %s\n', status);

                    // set the last status
                    timeService.setLastStatus(status);
                });
            } else {
                log.error(_.first(err.allErrors).message + '\n');
            }
        });
    });
};

function chooseGif() {
    var maxGifs = process.env.MAX_GIFS || 8;

    var filename = _.random(1, maxGifs) + '.gif';
    log.info('Uploading %s...', filename);
    return fs.readFileSync('./gifs/' + filename, { encoding: 'base64' });
}