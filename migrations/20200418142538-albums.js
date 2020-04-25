'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db, cb) {
    db.createTable('albums', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
            unsigned: true,
        },
        shortId: {
            type: 'string',
            notNull: true,
        },
        name: {
            type: 'string',
            notNull: true,
        }
    }, cb);
};

exports.down = function(db, cb) {
    db.removeForeignKey('items_to_albums', 'items_to_albums_album_id_fk', cb);
    
    db.dropTable('albums', cb);
};

exports._meta = {
    "version": 1
};
