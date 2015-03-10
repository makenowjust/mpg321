function which(cmd) {
  try {
    require('which').sync(cmd);
    return true;
  } catch (e) {
    return false;
  }
}

if (which('mpg321')) {
  // do nothing
} else if (which('mpg123')) {
  console.error('mpg123 command found! but mpg321 package don\'t supports mpg123 command enough!');
} else {
  console.error('please install mpg321 command for using mpg321 package.');
  console.error('see https://github.com/MakeNowJust/mpg321');
  process.exit(1);
}
  
