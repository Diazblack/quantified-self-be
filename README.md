# Quantified Self Be

## Introduction
This is the back-end for our Quantified Self calorie counter app.

## Initial Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

From GitHub clone down repository using the following commands in terminal:
* `git clone git@github.com:Diazblack/quantified-self-be.git`
* `cd quantified-self-be`

YOu may need to install some packages first:
`npm init --yes
npm install knex -g
npm install knex --save
npm install express -g
npm install express --save
npm install pg --save
npm install body-parser --save
`

Use the following commands to setup you test environment and database:
* `npm install -D mocha chai chai-http`
* `psql`
* `CREATE DATABASE quantified_self;`
* `knex migrate:latest`
* `knex seed:run`

## How to Use

### Running the Server Locally

To run the server locally run:
* `npm start`

In your browser visit:
* `http://localhost:8080/` to run your application.


## Endpoints
These are all the endpoints that can be hit.

### Food Endpoints
#### GET /api/v1/foods
This returns all foods currently in the database.  

Example output:

``` json
[
    {
        "id": 1,
        "name": "Tea",
        "calories": 100,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 3,
        "name": "Cake",
        "calories": 400,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 4,
        "name": "Avocado",
        "calories": 250,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 5,
        "name": "Salad",
        "calories": 250,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 6,
        "name": "Donut",
        "calories": 250,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 7,
        "name": "Burger",
        "calories": 700,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 8,
        "name": "Cauliflower",
        "calories": 50,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    },
    {
        "id": 2,
        "name": "Pizza Slice",
        "calories": 330,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    }
]
```

#### GET /api/v1/foods/:id
This returns a specific food when an id is passed in.  A 404 error is returned if the food is not found.

Example output:

```json
[
    {
        "id": 1,
        "name": "Tea",
        "calories": 100,
        "created_at": "2019-02-07T01:54:58.576Z",
        "updated_at": "2019-02-07T01:54:58.576Z"
    }
]
```

#### POST /api/v1/foods
A new food can be created using the following format:

``` json
{"name": "milk", "calories": 20}
```

BOTH food name and calories must be sent in.

If successful, this returns the food item that is created. A 400 status is returned if not successful.  

Example successful response:

```json
{
    "id": 9,
    "name": "milk",
    "calories": 20
}
```

Example failed response:
```json
{
    "error": "Expected format: { name: <String>, calories: <String> }. You're missing a \"name\" property."
}
```

#### PATCH /api/v1/foods/:id
This allows a food's name or calories to be updated.  
Changes should be sent in the following format:

```json
{"name": "chocolate milk", "calories": 20}
```

If successfully updated, the food will be returned with the updated information.  A status 400 code will be returned if not successful.

Example successful response:

```json
[
    {
        "name": "chocolate milk",
        "calories": 20,
        "id": 9
    }
]
```

#### DELETE /api/v1/foods/:id
This endpoint allows a food to be deleted.  A 204 status is returned if successful.  A 404 will be returned if the food id cannot be found.

### Meal Endpoints
#### GET /api/v1/meals
This endpoint shows all the meals in the database, including all their associated foods.

Example response:

```json
[
    {
        "id": 1,
        "name": "Breakfast",
        "foods": [
            {
                "id": 4,
                "name": "Avocado",
                "calories": 250
            }
        ]
    },
    {
        "id": 2,
        "name": "Snacks",
        "foods": [
            {
                "id": 8,
                "name": "Cauliflower",
                "calories": 50
            }
        ]
    },
    {
        "id": 3,
        "name": "Lunch",
        "foods": [
            {
                "id": 2,
                "name": "Pizza Slice",
                "calories": 330
            },
            {
                "id": 4,
                "name": "Avocado",
                "calories": 250
            }
        ]
    },
    {
        "id": 4,
        "name": "Dinner",
        "foods": [
            {
                "id": 7,
                "name": "Burger",
                "calories": 700
            }
        ]
    }
]
```

#### GET /api/v1/meals/:meal_id/foods
This endpoint returns all foods for a specified meal.  A 404 is returned is a meal with the given id does not exist.

Example successful response:

```json
{
    "id": 1,
    "name": "Breakfast",
    "foods": [
        {
            "id": 4,
            "name": "Avocado",
            "calories": 250
        }
    ]
}
```

#### POST /api/v1/meals/:meal_id/foods/:id
This endpoint adds a specified food to a specific meal and creates a relationship in the MealFoods table.  A 404 is returned if the specific meal or food id does not exist.

Example successful response:

```json
{
    "message": "Successfully added Donut to Breakfast"
}
```

#### DELETE /api/v1/meals/:meal_id/foods/:id
This endpoint deletes a specified meal from a specific meal.  It deletes the relationship between the food and the meal in the MealFood table and returns a the status 204 (content not found) when is successfull.

### Calendar Endpoints
#### GET /api/v1/calendar
This endpoint returns all calendar entries from the database, including the date of the entry, the caloric totals for goal, consumed, and remaining, and all food information associated with the meals at the time the entry was made.  

Example response:

```json
[
    {
        "id": 1,
        "date_str": "2018-02-05",
        "goal": 2000,
        "consumed": 1600,
        "remaining": 400,
        "meals": [
            {
                "id": 1,
                "name": "Breakfast",
                "foods": [
                    {
                        "id": 1,
                        "name": "Tea",
                        "calories": 200
                    }
                ]
            },
            {
                "id": 2,
                "name": "Snacks",
                "foods": [
                    {
                        "id": 8,
                        "name": "Fries",
                        "calories": 600
                    }
                ]
            },
            {
                "id": 3,
                "name": "Lunch",
                "foods": [
                    {
                        "id": 9,
                        "name": "Shawarma",
                        "calories": 600
                    }
                ]
            },
            {
                "id": 4,
                "name": "Dinner",
                "foods": [
                    {
                        "id": 10,
                        "name": "Salad",
                        "calories": 400
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "date_str": "2018-02-06",
        "goal": 2000,
        "consumed": 1900,
        "remaining": 100,
        "meals": [
            {
                "id": 1,
                "name": "Breakfast",
                "foods": [
                    {
                        "id": 1,
                        "name": "Tea",
                        "calories": 200
                    }
                ]
            },
            {
                "id": 2,
                "name": "Snacks",
                "foods": [
                    {
                        "id": 11,
                        "name": "Nuts",
                        "calories": 300
                    }
                ]
            },
            {
                "id": 3,
                "name": "Lunch",
                "foods": [
                    {
                        "id": 12,
                        "name": "Paella",
                        "calories": 1000
                    }
                ]
            },
            {
                "id": 4,
                "name": "Dinner",
                "foods": [
                    {
                        "id": 13,
                        "name": "Ceviche",
                        "calories": 400
                    }
                ]
            }
        ]
    }
]
```

#### POST /api/v1/calendar
This endpoint allows a user to create a new calendar date entry in the database.

A new entry must be sent in the following format:

```json
  {
        "date_str": "2019-02-07",
        "goal": 1800,
        "consumed": 1580,
        "remaining": 220,
        "meals": [
            {
                "id": 1,
                "name": "Breakfast",
                "foods": [
                    {
                        "id": 4,
                        "name": "Avocado",
                        "calories": 250
                    }
                ]
            },
            {
                "id": 2,
                "name": "Snacks",
                "foods": [
                    {
                        "id": 8,
                        "name": "Cauliflower",
                        "calories": 50
                    }
                ]
            },
            {
                "id": 3,
                "name": "Lunch",
                "foods": [
                    {
                        "id": 2,
                        "name": "Pizza Slice",
                        "calories": 330
                    },
                    {
                        "id": 4,
                        "name": "Avocado",
                        "calories": 250
                    }
                ]
            },
            {
                "id": 4,
                "name": "Dinner",
                "foods": [
                    {
                        "id": 7,
                        "name": "Burger",
                        "calories": 700
                    }
                ]
            }
        ]
    }
```

## Known Issues
* Deleting a food from a meal that does not have a relationship in the MealFoods table will not throw a error.
* Functionality to delete a calendar entry has not been created.

## Running tests
To run the tests from terminal use the command `mocha --exit`

## Core Contributors
* Cesar Jolibois - Github: [Diazblack](https://github.com/Diazblack)
* Jennifer Lao - Github: [jplao](https://www.github.com/jplao)

## Built With

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Express](https://expressjs.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)

## Production

To view this project in production visit <https://quantified-self-533.herokuapp.com/api/v1/foods/>.

[![Waffle.io - Columns and their card count](https://badge.waffle.io/Diazblack/quantified-self-be.svg?columns=all)](https://waffle.io/Diazblack/quantified-self-be)
