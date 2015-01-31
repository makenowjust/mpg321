# mpg321

The mpg321 wrapper for Node.js

[![npm](https://nodei.co/npm/mpg321.png)](https://nodei.co/npm/mpg321/)
[![Dependency Status](https://david-dm.org/MakeNowJust/mpg321.svg)](https://david-dm.org/MakeNowJust/mpg321)

## Prerequisite

It requires `mpg321`.

In ubuntu, you can install `mpg321`:

```
$ sudo apt-get install mpg321
```


## Install

```
$ npm install mpg321
```


### Example

```js
var
mpg321 = require('mpg321');

var
proc = mpg321()
  .loop(0) // infinity loop
  .file('./music.mp3')
  .exec();

// SIGINT hack
process.on('SIGINT', function (data) {
  process.exit();
});
```

or, use remote api.

```js
var
mpg321 = require('mpg321');

var
file = './music.mp3',
player = mpg321().remote();

// infinity loop
player.play(file);
player.on('end', function () {
  console.log('end');
  player.play(file);
});

// SIGINT hack
process.on('SIGINT', function () {
  process.exit();
});
```


## API

```
mpg321 = require('mpg321');
```

### `mpg321(options, files)`

`mpg321` is the mpg321 class constructor.
`options` is the options passing as arguments to mpg321 command. (default is empty array `[]`)
`files` is the file list passing as arguments to mpg321 command. (default is empty array `[]`)

```js
mpg321(['-b'], ['./music.mp3'])
```

### `mpg321().option(options)`, `mpg321().file(files)`

add options or files.

```js
mpg321().options('-b').file('./music.mp3')
```

### `mpg321().outputDevice(device)`

Please read `-o` section of `man mpg321`.

### `mpg321().audioDevice(device)`

Please read `-a` section of `man mpg321`.

### `mpg321().gain(volume)`

Please read `-g` section of `man mpg321`.

### `mpg321().skip(frame)`

Please read `-k` section of `man mpg321`.

### `mpg321().frames(frame)`

Please read `-n` section of `man mpg321`.

### `mpg321().list(listFile)`

Please read `-@` section of `man mpg321`.

### `mpg321().wav(wavFile)`

Please read `-w` section of `man mpg321`.

### `mpg321().loop(loopCount)`

Please read `-l` section of `man mpg321`.

### `mpg321().cdr(cdrFile)`

Please read `--cdr` section of `man mpg321`.

### `mpg321().au(auFile)`

Please read `--au` section of `man mpg321`.

### `mpg321().shuffle()`

Please read `-z` section of `man mpg321`.

### `mpg321().random()`

Please read `-z` section of `man mpg321`.

### `mpg321().verbose()`

Please read `-v` section of `man mpg321`.

### `mpg321().stdout()`

Please read `-s` section of `man mpg321`.

### `mpg321().test()`

Please read `-t` section of `man mpg321`.

### `mpg321().quiet()`

Please read `-q` section of `man mpg321`.

### `mpg321().restart()`

Please read `-3` section of `man mpg321`.

### `mpg321().version()`

Please read `-V` section of `man mpg321`.

### `mpg321().stereo()`

Please read `--stereo` section of `man mpg321`.

### `mpg321().aggressive()`

Please read `--aggressive` section of `man mpg321`.

### `mpg321().help()`

Please read `--help` section of `man mpg321`.

### `mpg321().longhelp()`

Please read `--longhelp` section of `man mpg321`.

### `mpg321().recursive()`

Please read `-B` section of `man mpg321`.

### `mpg321().reportAudioScrobble()`

Please read `-S` section of `man mpg321`.

### `mpg321().title()`

Please read `-x` section of `man mpg321`.

### `mpg321().basicKeys()`

Please read `-K` section of `man mpg321`.

### `mpg321().exec(execOptions, callback)`

Call mpg321 command via `child_process.execFile`.
If `execOptions` is callable, use as `callback`.

### `mpg321().spawn(spawnOptions)`

Call mpg321 command via `child_process.spawn`.

### `mpg321().remote(fft)`

Call mpg321 command with '-R' option.
And if `fft` is `true`, append `-F` flag to options.

It returns `mpg321.remote` instance.

### `mpg321.remote().play(filename)`

Please read `LOAD` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote().jump(frame)`

Please read `JUMP` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote().gain(volume)`

Please read `GAIN` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote().pause()`

Please read `PAUSE` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote().stop()`

Please read `STOP` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote().quit()`

Please read `QUIT` command section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote`'s event `stop`, `pause`, `resume` and `end`

Please read `@P` section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote`'s event `error`

Please read `@E` section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote`'s event `frame`

Please read `@F` section of `/usr/share/doc/mpg321/README.remote` (debian).

### `mpg321.remote`'s event `info`

Please read `@I` section of `/usr/share/doc/mpg321/README.remote` (debian).


## Author

TSUYUSATO Kitsune (GitHub: @MakeNowJust, Twitter: @make\_now\_just)


## License

Apache-2.0. Please read `LICENSE`.

## Contribute

  1. Fork this repository.
  2. Checkout your feature branch.
  3. Commit your change.
  4. Push and Pull request.

Welcome your pull request :smile:
