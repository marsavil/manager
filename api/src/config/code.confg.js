

module.exports = {
  getCode : (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345678900";
    let code = "";
    let i;
    while (code.length < length){
      i= chars.charAt(Math.floor(Math.random() * chars.length));
      if ( !code.includes(i))
      code += i
    }
    return code
  }
}
