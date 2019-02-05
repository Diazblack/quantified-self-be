function mealNotation(meals) {
  var brea  = {"id": 1 , "name": "Breakfast" , "foods": [] }
  var lunch  = {"id": 2 , "name": "Lunch" , "foods": [] }
  var dinner = {"id": 3 , "name": "Dinner" , "foods": [] }
  var snacks  = {"id": 4 , "name": "Snacks" , "foods": [] }

  for (var i = 0; i <= meals.length; i++ ) {

    if(meals[i].mealId === 1){
      food = { "id": meals[i].id, "name": meals[i].name, "calories": meals[i].calories }
      brea.foods.push(food);
    }
    else if (meals[i].mealId === 2) {
      food = { "id": meals[i].id, "name": meals[i].name, "calories": meals[i].calories }
      lunch.foods.push(food);
    }
    else if (meals[i].mealId === 3 ) {
      food = { "id": meals[i].id, "name": meals[i].name, "calories": meals[i].calories }
      dinner.foods.push(food);
    }
    else if (meals[i].mealId === 4 ) {
      food = { "id": meals[i].id, "name": meals[i].name, "calories": meals[i].calories }
      snacks.foods.push(food);
    }
  }
   return [brea, lunch , dinner , snacks]

}

module.exports = {
  mealNotation,
}
