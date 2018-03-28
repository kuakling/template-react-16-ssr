import mongoose from "mongoose";
import Promise from "bluebird";


mongoose.Promise = Promise;


// const Schema = mongoose.Schema;
const host = process.env.HOST && 'mongodb';
console.log('Connecting mongoDb')

const COMPOSE_URI_DEFAULT = `mongodb://mongodb/commsci_db`;
mongoose.connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, function (error) {
  if (error) console.error('มีเออเร่อ ', error)
  else console.log('ไม่เออเร่อนะ mongo connected')
})