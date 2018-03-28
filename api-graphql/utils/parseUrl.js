export function urlDotToStr(str = "",  searchvalue = "{dot}", newvalue = ".") {
  let r = decodeURI(str);
  r = r.replace(new RegExp(searchvalue, "g"), newvalue);
  return r;
}