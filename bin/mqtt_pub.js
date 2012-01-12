#!/usr/bin/env node

var mqtt = require('../lib/mqtt');

var argv = process.argv;

for (var i = 2; i <= 5; i++) {
	if(!argv[i]) process.exit(-1);
}

var port = argv[2],
	host = argv[3],
	topic = argv[4],
	payload = argv[5];

mqtt.createClient(port, host, function(client) {
	client.connect({keepalive: 3000});

	client.on('connack', function(packet) {
		if (packet.returnCode === 0) {
		    client.publish({topic: topic, payload: payload});
			client.disconnect();
		} else {
			console.log('connack error %d', packet.returnCode);
			process.exit(-1);
		}
	});

	client.on('close', function() {
		process.exit(0);
	});

	client.on('error', function(e) {
		console.log('error %s', e);
		process.exit(-1);
	});
});
