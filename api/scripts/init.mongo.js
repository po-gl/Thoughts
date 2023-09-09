/*
 * Run using the mongo shell:
 * localhost:
 *   mongo thoughtorganizer scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/thoughtorganizer scripts/init.mongo.js
*/

/* global db print */
/* eslint no-restricted-globals: "off" */

db.maps.deleteMany({});
db.deleted_maps.deleteMany({});

const initialMaps = [
  {
    user: 'porter',
    created: new Date('2023-08-30'),
    modified: new Date('2023-08-30'),
    title: 'My map',
    description: '*placeholder for map description*',
    graph: '*placeholder for json graph*',
  },
  {
    user: 'sam',
    created: new Date('2023-08-29'),
    modified: new Date('2023-08-30'),
    title: 'My mind map',
    description: '*placeholder for map description*',
    graph: '*placeholder for json graph*',
  },
];

db.maps.insertMany(initialMaps);

const count = db.maps.countDocuments();
print('Inserted', count, 'maps');

db.maps.createIndex({ user: 1 });
db.maps.createIndex({ created: 1 });
db.maps.createIndex({ modified: 1 });
