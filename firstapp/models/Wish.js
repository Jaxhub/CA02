
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var wishSchema = Schema( {
  pokemon: String,
  ability: String,
  type1: String,
  type2: String,
  uuid: { type: String, default: () => uuidv4() }
} );

module.exports = mongoose.model( 'Wish', wishSchema );

