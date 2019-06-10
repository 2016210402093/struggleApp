export default function verifypassword(pw) {
  let strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");//强
  let mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g")  //中
  let enoughRegex = new RegExp("(?=.{6,}).*", "g") //弱

  console.log(pw);

  if(strongRegex.test(pw)){
    return '强';
  }
  else if (mediumRegex.test(pw)){
    return '中';
  }
  else if(enoughRegex.test(pw)){
    return '弱';
  }
  else {
    return '弱';
  }
}
