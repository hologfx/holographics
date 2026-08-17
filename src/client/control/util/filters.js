import Vue from 'vue'

Vue.filter("format_size", (num_bytes) => {
  var num_bytes_abs = Math.abs(num_bytes);
  if(num_bytes_abs <= 1024 * 0.8) {
    return num_bytes + " B";
  } else if(num_bytes_abs <= 1024 * 1024 * 0.8) {
    return parseInt(num_bytes / 1024, 10) + "." + parseInt(num_bytes / 1024 * 10, 10) % 10 + " KB";
  } else if(num_bytes_abs <= 1024 * 1024 * 1024 * 0.8) {
    return parseInt(num_bytes / 1024 / 1024, 10) + "." + parseInt(num_bytes / 1024 / 1024 * 10, 10) % 10 + " MB";
  } else {
    return parseInt(num_bytes / 1024 / 1024 / 1024, 10) + "." + parseInt(num_bytes / 1024 / 1024 / 1024 * 10, 10) % 10 + " GB";
  }
})