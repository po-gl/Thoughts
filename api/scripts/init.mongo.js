/*
 * Run using the mongo shell:
 * localhost:
 *   mongosh thoughtorganizer scripts/init.mongo.js
 * Atlas:
 *   mongosh CONNECTION_STRING scripts/init.mongo.js
*/

/* global db print */
/* eslint no-restricted-globals: "off" */

db.maps.deleteMany({});
db.deleted_maps.deleteMany({});

const initialMaps = [
  {
    user: 'tester',
    created: new Date('2023-08-30'),
    modified: new Date('2023-08-30'),
    title: 'Test map',
    description: '*placeholder for map description*',
    graph: '{"nodes":[{"width":201,"height":59,"id":"1","type":"thought","position":{"x":438.35250708390174,"y":181.0561207617294},"data":{"text":"Fruits"},"positionAbsolute":{"x":438.35250708390174,"y":181.0561207617294},"x":438.35250708390174,"y":181.0561207617294,"index":0,"vy":0.13511640995343635,"vx":-0.033340931926759354,"fx":null,"fy":null},{"width":201,"height":59,"id":"2","type":"thought","position":{"x":-368.4228881640444,"y":292.6500589489693},"data":{"text":"Fries"},"positionAbsolute":{"x":-368.4228881640444,"y":292.6500589489693},"x":-368.4228881640444,"y":292.6500589489693,"index":1,"vy":0.08284399278135621,"vx":0.04715978471562967,"fx":null,"fy":null},{"width":201,"height":59,"id":"3","type":"thought","position":{"x":-21.72282254229506,"y":-445.96638753560455},"data":{"text":"Lies"},"positionAbsolute":{"x":-21.72282254229506,"y":-445.96638753560455},"x":-21.72282254229506,"y":-445.96638753560455,"index":2,"vy":-0.07558715102287225,"vx":-0.035822703664262184,"fx":null,"fy":null},{"width":201,"height":59,"id":"4","type":"thought","position":{"x":-7.657771247593854,"y":43.821731348815874},"data":{"text":"And butterflies"},"positionAbsolute":{"x":-7.657771247593854,"y":43.821731348815874},"x":-7.657771247593854,"y":43.821731348815874,"index":3,"vy":-0.09234177632528502,"vx":-0.014582877697719918,"fx":null,"fy":null}],"edges":[],"viewport":{"x":369.4887168703674,"y":843.6044044737653,"zoom":0.8822312127119983}}',
  },
  {
    user: 'tester',
    created: new Date('2023-09-2'),
    modified: new Date('2023-09-2'),
    title: 'Test map 2',
    description: '*placeholder for map description*',
    graph: '{"nodes":[{"width":201,"height":59,"id":"1","type":"thought","position":{"x":473.59337539902253,"y":457.53305557903803},"data":{"text":"Fruits"},"positionAbsolute":{"x":473.59337539902253,"y":457.53305557903803},"x":473.59337539902253,"y":457.53305557903803,"index":0,"vy":-0.047360297526555906,"vx":0.2920789570060746,"fx":null,"fy":null},{"width":201,"height":59,"id":"2","type":"thought","position":{"x":633.2019591596057,"y":-197.80166597630708},"data":{"text":"Healthy","isGenerated":true},"positionAbsolute":{"x":633.2019591596057,"y":-197.80166597630708},"x":633.2019591596057,"y":-197.80166597630708,"index":1,"vy":0.17405382037991163,"vx":0.3287178380605014,"fx":null,"fy":null},{"width":201,"height":59,"id":"3","type":"thought","position":{"x":-268.96761404651687,"y":364.30932957215384},"data":{"text":"Fries"},"positionAbsolute":{"x":-268.96761404651687,"y":364.30932957215384},"x":-268.96761404651687,"y":364.30932957215384,"index":2,"vy":0.20885736874953706,"vx":-0.3347188357133298,"fx":null,"fy":null},{"width":201,"height":59,"id":"4","type":"thought","position":{"x":-544.999425725577,"y":-208.95420052626994},"data":{"text":"Fast Food","isGenerated":true},"positionAbsolute":{"x":-544.999425725577,"y":-208.95420052626994},"x":-544.999425725577,"y":-208.95420052626994,"index":3,"vy":0.1420727461793296,"vx":-0.0591284058775535,"fx":null,"fy":null},{"width":201,"height":59,"id":"5","type":"thought","position":{"x":410.664407129063,"y":93.37271310032713},"data":{"text":"Lies"},"positionAbsolute":{"x":410.664407129063,"y":93.37271310032713},"x":410.664407129063,"y":93.37271310032713,"index":4,"vy":-0.007815852523127132,"vx":-0.13840775238823924,"fx":null,"fy":null},{"width":201,"height":59,"id":"6","type":"thought","position":{"x":94.33682740629177,"y":-90.75163360800362},"data":{"text":"Deception","isGenerated":true},"positionAbsolute":{"x":94.33682740629177,"y":-90.75163360800362},"x":94.33682740629177,"y":-90.75163360800362,"index":5,"vy":-0.18730844305482283,"vx":0.3083211365078939,"fx":null,"fy":null},{"width":201,"height":59,"id":"7","type":"thought","position":{"x":-146.33123287060653,"y":-277.5422230109864},"data":{"text":"Butterflies","isGenerated":true},"positionAbsolute":{"x":-146.33123287060653,"y":-277.5422230109864},"x":-571.6937479296006,"y":117.77609953454709,"index":6,"vy":-0.3254671480510271,"vx":-0.047520642373318635,"fx":null,"fy":null,"selected":true,"dragging":false},{"width":201,"height":59,"id":"8","type":"thought","position":{"x":350.66663583416323,"y":-509.16744932036016},"data":{"text":"Nature","isGenerated":true},"positionAbsolute":{"x":350.66663583416323,"y":-509.16744932036016},"x":-199.6164691492194,"y":-488.6108965479924,"index":7,"vy":-0.06931007629699308,"vx":-0.3823481398508689,"fx":null,"fy":null,"selected":false,"dragging":false}],"edges":[{"id":"1-2","type":"floating","source":"1","target":"2","data":{"justification":"Fruits are often associated with being healthy"}},{"id":"3-4","type":"floating","source":"3","target":"4","data":{"justification":"Fries are a common type of fast food"}},{"id":"5-6","type":"floating","source":"5","target":"6","data":{"justification":"Lies are a form of deception"}},{"id":"7-8","type":"floating","source":"7","target":"8","data":{"justification":"Butterflies are part of nature"}}],"viewport":{"x":405.99467357733937,"y":793.1709888466435,"zoom":0.6324017525679057}}',
  },
];

db.maps.insertMany(initialMaps);

const count = db.maps.countDocuments();
print('Inserted', count, 'maps');

db.maps.createIndex({ user: 1 });
db.maps.createIndex({ created: 1 });
db.maps.createIndex({ modified: 1 });

db.deleted_maps.createIndex({ user: 1 });
