var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://api.spoonacular.com/recipes/findByIngredients',
  params: {
    ingredients: 'chickpea',
    number: '5',
    ranking: '1',
    ignorePantry: 'true',
    apiKey: '6856e722b1b94a23baf2de9fffd20345',
  },
  headers: {
    'Content-Type': 'application/json',
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});