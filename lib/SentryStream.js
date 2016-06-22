'use strict';

var _ = require('lodash');

// // //

/**
 * Sentry stream for Bunyan
 */
var SentryStream = function SentryStreamConstructor(client) {
  /**
   * SentryStream client
   * @param  {Object} client the Sentry client
   * @return {void}
   */
  this.client = client;

  /**
   * Method call by Bunyan to save log record
   * @param  {Object} record log properties
   * @return {Boolean}        true
   */
  this.write = function writeFunc(record) {
    var err = record.err;
    var level = this.getSentryLevel(record);
    var extra;

    if (err) {
      extra = _.omit(record, 'err');
      this.client.captureException(this.deserializeError(err), { extra, level });
    } else {
      extra = _.omit(record, 'msg');
      this.client.captureMessage(record.msg, { extra, level });
    }
    return (true);
  };

  /**
   * Convert Bunyan level number to Sentry level label.
   * Rule : >50=error ; 40=warning ; info otherwise
   * @param  {Object} record Bunyan log record
   * @return {String}        Sentry level
   */
  this.getSentryLevel = function getSentryLevelFunc(record) {
    var level = record.level;

    if (level >= 50) return 'error';
    if (level === 40) return 'warning';

    return 'info';
  };

  /**
   * Error deserialiazing function. Bunyan serialize the error to object : https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L1089
   * @param  {object} data serialized Bunyan
   * @return {Error}      the deserialiazed error
   */
  this.deserializeError = function deserializeErrorFunc(data) {
    if (data instanceof Error) return data;

    var error = new Error(data.message);
    error.name = data.name;
    error.stack = data.stack;
    error.code = data.code;
    error.signal = data.signal;
    return error;
  };
};

module.exports = SentryStream;
