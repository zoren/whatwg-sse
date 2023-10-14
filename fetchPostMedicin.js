// const formData = new FormData();
// formData.append("updateMode", "false");
// let body = "updateMode=false&name=d&description=D&lowerHalfLifeHours=0.1&upperHalfLifeHours=13&initialDefaultDosageMilligramsIndex=0&dosageMilligrams=1&dosageMilligrams=&dosageMilligrams=&dosageMilligrams=&dosageMilligrams=";
const body = new URLSearchParams();
body.append("updateMode", "false");
body.append("name", "d");
body.append("description", "D");
body.append("lowerHalfLifeHours", "0.1");
body.append("upperHalfLifeHours", "13");
body.append("dosageMilligrams", "10");
body.append("dosageMilligrams", "20");
body.append("dosageMilligrams", "30");
body.append("dosageMilligrams", "");
body.append("dosageMilligrams", "");
body.append("initialDefaultDosageMilligramsIndex", "2");
const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,da;q=0.8,nb;q=0.7,sv;q=0.6",
  // "cache-control": "no-cache",
  "content-type": "application/x-www-form-urlencoded",
  "pragma": "no-cache",
  // "sec-ch-ua": "\"Google Chrome\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
  // "sec-ch-ua-mobile": "?0",
  // "sec-ch-ua-platform": "\"macOS\"",
  // "sec-fetch-dest": "document",
  // "sec-fetch-mode": "navigate",
  // "sec-fetch-site": "same-origin",
  // "sec-fetch-user": "?1",
  // "upgrade-insecure-requests": "1",
  "cookie": "s=plVX3cQAmnEoFaRMPWPgHjuKrM0yzXOPX0Ru-LsDEcQ",
  "Referer": "http://localhost:1337/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
const headersObject = new Headers(headers);
console.log(headersObject);
const response = await fetch("http://localhost:4000/medication", {
  "headers": headersObject,
  "body": body,
  "method": "POST"
});
console.log(response.status, response.statusText, await response.text());
