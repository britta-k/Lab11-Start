//1- Link to get a random meal
//https://www.themealdb.com/api/json/v1/1/random.php

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=

const mealsElement = document.getElementById("meals");
const favoritesElement = document.querySelector(".favorites");
getRandomMeal();
updateFavoriteMeals();

async function getRandomMeal() 
{
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const randomData = await resp.json(); //converts the json data 
    const randomMeal = randomData.meals[0];

    mealsElement.innerHTML = "";
    addMeal(randomMeal);
}

function addMeal(mealData) 
{
    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `<div class="meal-header">
                        <span class="random">Meal of the Day</span>
                        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                    </div>
                    <div class="meal-body">
                        <h3>${mealData.strMeal}</h3>
                        <button class="fav-btn">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>`;
    let favoriteButton = meal.querySelector(".fav-btn");
    favoriteButton.addEventListener("click", ()=>{
        if(favoriteButton.classList.contains("active"))
        {
            favoriteButton.classList.remove("active");
            removeMealFromLocalStorage(mealData.idMeal);
        }
        else
        {
            favoriteButton.classList.add("active");
            addMealToLocalStorage(mealData.idMeal);
        }

        updateFavoriteMeals();
    })
    mealsElement.appendChild(meal);
}

function addMealToLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    //console.log(mealIds);
    localStorage.setItem("mealIds",JSON.stringify([...mealIds,mealId]));
}

function removeMealFromLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem("mealIds",JSON.stringify(
        mealIds.filter(id => id!=mealId)
    ));
}

function getMealsFromLocalStorage()
{
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    
    return mealIds === null? [] : mealIds;
}

async function updateFavoriteMeals()
{
    favoritesElement.innerHTML = "";
    const mealIds = getMealsFromLocalStorage();
    for(let i = 0; i<mealIds.length; i++)
    {
        let tmpMeal = await getMealByID(mealIds[i]);
        //console.log(tmpMeal);
        addMealToFavorites(tmpMeal);
    }
}

async function getMealByID(id)
{
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
    const respData = await resp.json(); //converts the json data 
    const meal = respData.meals[0];
    //console.log(meal);

    return meal;
}

function addMealToFavorites(mealData)
{

    const favoriteMeal = document.createElement("li");
    favoriteMeal.innerHTML = `
                <img id="fav-img" 
                    src="${mealData.strMealThumb}" 
                    alt="${mealData.strMeal}">
                <span>${mealData.strMeal}</span>
                <button class="clear"><i class="fas fa-window-close"></i></button>`;
    const clearBtn = favoriteMeal.querySelector(".clear");
    clearBtn.addEventListener("click", ()=>{
        removeMealFromLocalStorage(mealData.idMeal);
        updateFavoriteMeals();
    })
    favoritesElement.appendChild(favoriteMeal);
}