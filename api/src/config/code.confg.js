

module.exports = {
  getAffiliateCode : (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
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
