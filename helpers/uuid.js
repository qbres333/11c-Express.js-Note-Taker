// export a function that generates a random hexadecimal string
module.exports = () =>
  // "0x10000" is hexadecimal for 65536 (2^16), max value for 16-bit integer
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16) //converts integer to hexadecimal string, 4-characters long
    .substring(1); //ensures string does not start with 0

