const api = "url";
const options = {
  method: "GET",
  headers: {
    Authorization: "Auth_token"
  },
}
const response = fetch(api, options) 
console.log(response.json())
