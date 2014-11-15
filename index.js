var
util = require('util'),
child_process = require('child_process'),
EventEmitter = require('events').EventEmitter,
event_stream = require('event-stream');

// Utils

// process for each object keys and values.
// `fn` is 3 arity function like `fn(key, value, obj)`.
function each(obj, fn) {
  Object.keys(obj).forEach(function (k, i) {
    fn(k, obj[k], obj);
  });
}

// it returns mpg321 command's path,
// trying environment variable MPG321_PATH and MPG123_PATH.
function mpg321path() {
  return process.env.MPG321_PATH || process.env.MPG123_PATH || 'mpg321';
};

// class mpg321

// `mpg321` is the mpg321 class constructor.
// `options` is the options passing as arguments to mpg321 command. (default is empty array `[]`)
// `files` is the file list passing as arguments to mpg321 command. (default is empty array `[]`)
function mpg321(options, files) {
  // called without `new`, it returns new instance.
  if (!(this instanceof mpg321)) return new mpg321(options, files);

  this._options = options || [];
  this._files = files || [];
}

// add options passing as arguments to mpg321 command.
mpg321.prototype.option = function option() {
  this._options.push.apply(this._options, arguments);
  return this; // for method chain
};

// add files passing as arguments to mpg321 command.
mpg321.prototype.file = function file() {
  this._files.push.apply(this._files, arguments);
  return this; // for method chain
};

// options requiring next argument
each({
  // there options have long name and short name.
  'outputdevice': '-o',
  'audiodevice' : '-a',
  'gain'        : '-g',
  'skip'        : '-k',
  'frames'      : '-n',
  'list'        : '-@',
  'wav'         : '-w',
  'loop'        : '--loop',

  // there options have long name only.
  'cdr'         : '--cdr',
  'au'          : '--au',

  // TODO: what is '-b' option?
}, function (name, optName) {
  mpg321.prototype[name] = function (value) {
    // if `value` is `null`, not set options.
    if (value !== null) {
      this._files.push(optName, value);
    }
    return this;
  };
});

// flag options
each({
  // there options have long name and short name.
  'shuffle': '-z',
  'random': '-Z',
  'verbose': '-v',
  'stdout': '-s',
  'test': '-t',
  'quiet': '-q',
  'restart': '-3',
  'version': '-V',

  // there options have long name only.
  'stereo': '--stereo',
  'aggressive': '--aggressive',
  'help': '--help',
  'longhelp': '--longhelp',

  // there options have short name only.
  'recursive': '-B',
//'fft': '-F',
  'reportAudioScrobbler': '-S',
  'title': '-x',
  'basicKeys': '-K',
//'remote': '-R',
}, function (name, optName) {
  mpg321.prototype[name] = function (flag) {
    // if `flag` is `false` or `null`. not set options.
    if (flag !== null && flag !== false) {
      this._options.push(optName);
    }
    return this;
  };
});

// call mpg321 command via `child_process.execFile`.
mpg321.prototype.exec = function exec(execOptions, callback) {
  // if `execOptions` is callable, use as `callback`.
  if (typeof execOptions === 'function') {
    callback = execOptions;
    execOptions = {};
  }

  child = child_process.execFile(mpg321path(), this._options.concat(this._files), execOptions, callback);
  process.on('exit', function () { child.kill(); }); // TODO: really want auto kill?
  return child;
};

// call mpg321 command via `child_process.spawn`.
mpg321.prototype.spawn = function spawn(spawnOptions) {
  child = child_process.spawn(mpg321path(), this._options.concat(this._files), spawnOptions);
  process.on('exit', function () { child.kill(); }); // TODO: really want auto kill?
  return child;
};

// call mpg321 command with '-R' option.
// and if `fft` is `true`, append `-F` flag to options.
mpg321.prototype.remote = function remote(fft) {
  if (fft === true) {
    this._options.push('-F');
  }
  this._options.push('-R', 'abcd');
  return new mpg321remote(this.spawn());
};

// class mpg321remote

function mpg321remote(child) {
  this.child = child;
  setupStreamHandler(this, child.stdout);
  setupStreamHandler(this, child.stderr);
}

function setupStreamHandler(emitter, stream) {
  stream
    .pipe(event_stream.split())
    .pipe(event_stream.through(function (line) {
      line = line.split(' ');

      switch (line[0]) {
        case '@P':
          emitter.emit(['stop', 'pause', 'resume', 'end'][+line[1]]);
          break;
        case '@E':
          line.shift();
          emitter.emit('error', new Error(line.join(' ')));
          break;
        case '@F':
          line.shift();
          emitter.emit('frame', line);
          break;
        case '@I':
          line.shift();
          emitter.emit('info', line);
      }
    }));
}

util.inherits(mpg321remote, EventEmitter);

mpg321remote.prototype.command = function command() {
  this.child.stdin.write([].join.call(arguments, ' ') + '\n');
};

each({
  'play': 'LOAD',
  'jump': 'JUMP',
  'gain': 'GAIN',
}, function (name, cmdName) {
  mpg321remote.prototype[name] = function (value) {
    this.command(cmdName, value);
  };
});

each({
  'pause': 'PAUSE',
  'stop':  'STOP',
  'quit':  'QUIT',
}, function (name, cmdName) {
  mpg321remote.prototype[name] = function () {
    this.command(cmdName);
  };
});

mpg321.remote = mpg321remote;

module.exports = mpg321;
