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
    db.createTable('items_to_albums', {
        id: {
            type: "int",
            primaryKey: true,
            autoIncrement: true,
            unsigned: true,
        },
        album_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
                name: 'items_to_albums_album_id_fk',
                table: 'albums',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                mapping: 'id',
            }
        },
        item_id: {
            type: 'int',
            unsigned: true,
            notNull: true,
            foreignKey: {
                name: 'items_to_albums_item_id_fk',
                table: 'items',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                mapping: 'id',
            },
        }
    }, cb);
};

exports.down = function(db, cb) {
    db.removeForeignKey('items_to_albums', 'items_to_albums_album_id_fk', cb);
    db.removeForeignKey('items_to_albums', 'items_to_albums_item_id_fk', cb);

    db.dropTable('items_to_albums', cb);
};

exports._meta = {
  "version": 1
};
