let elementId = [];
let randomMealBlock = document.querySelector("#meals");
let favMealsContainer = document.querySelector("#fav_meals");
let mobileContainer = document.querySelector(".mobile_container");
let categoriesContainer = document.querySelector(".categories");
let mealsCategoryContainer = document.querySelector(".meals_category");
let mealsCategoryContainerMain = document.querySelector(".meal_category_main");
let popUpConteiner = document.querySelector(".popup_container");
let popupMealBlock = document.querySelector(".popup_container_main");
let inputSearch = document.querySelector(".input_search");
let searchBtn = document.querySelector("#search");
let categoriesBtn = document.querySelector("#categories");

let getRandomMeal = () => {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(responce => responce.json())
        .then(data => {
            loadMeal(data.meals[0])
        });
}

let getMealById = (id, i) => {
    return fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
        .then(responce => responce.json())
        .then(data => {
            elementId = data.meals[0];

            switch (i) {
                case 1: addMealToFav(elementId);
                    break;
                case 2: showPopupInfo(elementId);
                    break;
                case 3: showPopupInfo(elementId, false);
                    break;
            }
        })
}

let getMealsBySerch = (input) => {
    randomMealBlock.innerHTML = ""
    return fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + input)
        .then(responce => responce.json())
        .then(data => {
            searchMeal = data.meals;
            if (searchMeal === null) {
                alert("wrong main ingredient")
            }
            searchMeal.forEach(el => loadMeal(el, false))

        })
}

let setHtml = (container, data, refresh) => {
    refresh ? container.innerHTML = data : container.innerHTML += data;
}

let getAllCategories = () => {
    // setHtml(categoriesContainer, '', true);
    categoriesContainer.innerHTML = "";
    return fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(responce => responce.json())
        .then(data => loadCategories(data.categories))


}

let getMealsByCategory = (category) => {
    return fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category)
        .then(responce => responce.json())
        .then(data => loadMaelsCategory(data.meals))
}





let loadMeal = (randomMealData, random = true) => {



    randomMealBlock.innerHTML += `
         <div class="meal">

                                        <div class="meal_header">
                                                  ${random ? `<span class="random">Random recipe</span>` : ""}
                                                  <img class="img_btn" data-index=${randomMealData.idMeal} src=${randomMealData.strMealThumb}>
                                        </div>
                                        <div class="meal_body">
                                                  <h4>${randomMealData.strMeal}</h4>
                                                  <a href="#"  class="fav_btn"><i index=${randomMealData.idMeal} ${checkIsFav(randomMealData.idMeal) ? `class="fas fa-heart active"` : `class="fas fa-heart"`}></i></a>
                                        </div>
                              </div>
         `

}

let loadCategories = (categoriesData) => {
    categoriesData.forEach(el => {
        categoriesContainer.innerHTML += `
        <div class="categories_block ">
        <h3 data-index=${el.strCategory} class="categories_img">${el.strCategory}</h3>
        <img data-index=${el.strCategory} class="categories_img" src=${el.strCategoryThumb} alt=${el.strCategory}>
        </div >
            `
    });

}

let loadMaelsCategory = (mealsData) => {
    mealsData.forEach(el => {
        mealsCategoryContainer.innerHTML += `
        <div class="meals_category_el">
        <img class="img_btn" index=${el.idMeal} src=${el.strMealThumb}
                  alt="">
        <span title="${el.strMeal}">${el.strMeal.length < 25 ? el.strMeal : el.strMeal.substring(0, 25) + "..."}</span>
        </div>
    
    `
    })
}

let addMealToFav = (meal) => {
    favMealsContainer.innerHTML += `
    <li><img data-index=${meal.idMeal} class="fav_img_btn" src=${meal.strMealThumb}
        alt="">
        <span title="${meal.strMeal}">${meal.strMeal.substring(0, 6) + "..."}</span>
        <button class="close_btn"><i index="${meal.idMeal}" class="fas fa-times"></i></button></li>
`

}

let addMealLs = (data) => {
    const mealsId = getMealsLs();
    localStorage.setItem("mealsId", JSON.stringify([...mealsId, data]))
}

let getMealsLs = () => {
    const mealsId = JSON.parse(localStorage.getItem("mealsId"));
    return mealsId === null ? [] : mealsId.filter(el => el !== null);

}

let removeMealLs = (data) => {
    const mealsId = getMealsLs();
    localStorage.setItem("mealsId", JSON.stringify(mealsId.filter(id => id !== data)));
}

let fetchDataFromLS = () => {
    favMealsContainer.innerHTML = "";
    const mealsId = getMealsLs();
    mealsId.forEach(el => getMealById(el, 1))
}

let showPopUp = () => {
    mobileContainer.classList.add("hide");
    popUpConteiner.classList.remove("hide");

}

let closepopup = () => {
    popupMealBlock.innerHTML = "";
    mobileContainer.classList.remove("hide");
    popUpConteiner.classList.add("hide");
}

let getIngredients = (mealData) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]} `)
        }
        else {
            break;
        }
    };
    return ingredients
}

let showPopupInfo = (mealData, random = true) => {
    const url = mealData.strYoutube.replace("watch?v=", "embed/")
    const ingredients = getIngredients(mealData);

    popupMealBlock.innerHTML = `
    <div class="popup">
        <h1>${mealData.strMeal}</h1>
                                        ${random ? `<img src=${mealData.strMealThumb}
                                        alt="${mealData.strMeal}">` : `<iframe width="100%" height="500px" src="${url}" frameborder="0" &autoplay=1 allowfullscreen>
                                        </iframe>`}
                                        <div class="popup_btn">
                                        <button class="yuotube" id="yuotube"><i data-index=${mealData.idMeal} class="fab fa-youtube"></i></button>
                                        <button class="fav_btn"><i index=${mealData.idMeal} ${checkIsFav(mealData.idMeal) ? `class="fas fa-heart active"` : `class="fas fa-heart"`}></i></button>
                                        </div>
                              </div >
                              
                              <div class="popup instructions">
                                        <span>${mealData.strInstructions.replaceAll("\r\n", "<br>")}</span>
                              </div>
                              <div class="popup_ingredient">
                                        <h3>Ingredients:</h3>
                                        <ul>
                                                 ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
                                        </ul>
                              </div>
                              <button class="close_popup"><i index-close=${mealData.idMeal} class="fas fa-times"></i></button>
    `
}

let getIdByAttribute = (event, targetAttribute, attribute) => {
    const id = event.target.getAttribute(targetAttribute)
    const classList = Array.from(event.target.classList);
    return !classList.includes(attribute) ? undefined : id
}

let showInfoFavContainer = (event) => {
    showPopUp();
    getMealById(getIdByAttribute(event, "data-index", "fav_img_btn"), 2)
}

let showCategories = () => {
    randomMealBlock.classList.add("hide");
    mealsCategoryContainerMain.classList.add("hide");
    categoriesContainer.classList.remove("hide");
    getAllCategories()
}

let showMealsByCategory = (event) => {
    categoriesContainer.classList.add("hide");
    mealsCategoryContainerMain.classList.remove("hide");
    const category = getIdByAttribute(event, "data-index", "categories_img");
    getMealsByCategory(category);
}

let showInfoMealsCategory = (event) => {
    showPopUp();
    getMealById(getIdByAttribute(event, "index", "img_btn"), 2);
}

let remuveMealFromFavContainer = (event) => {
    getIdByAttribute(event, "index", "fa-times")
    removeMealLs(getIdByAttribute(event, "index", "fa-times"));
    fetchDataFromLS();
}


let showInfoFromSearch = (event) => {
    showPopUp()
    getMealById(getIdByAttribute(event, "data-index", "img_btn"), 2)
}

let addMealToFavFromSearch = (event) => {
    const id = getIdByAttribute(event, "index", "fa-heart");
    const mealsIdLs = getMealsLs();

    if (mealsIdLs.includes(id)) {
        removeMealLs(id);
        event.target.classList.remove("active")
    } else {
        addMealLs(id);
        event.target.classList.add("active");
    }
    fetchDataFromLS()

}

let showYoutube = (event) => {
    getMealById(getIdByAttribute(event, "data-index", "fa-youtube"), 3)
}


let checkIsFav = (id) => {
    return isFavorite = getMealsLs().includes(id);
}

let bindEvents = () => {

    favMealsContainer.addEventListener("click", (event) => event.target.classList.contains("fav_img_btn") ? showInfoFavContainer(event) : remuveMealFromFavContainer(event));

    searchBtn.addEventListener("click", () => {
        if (randomMealBlock.classList.contains("hide")) {
            randomMealBlock.classList.remove("hide")
        };
        if (!categoriesContainer.classList.contains("hide")) {
            categoriesContainer.classList.add("hide")
        };
        if (!mealsCategoryContainerMain.classList.contains("hide")) {
            mealsCategoryContainerMain.classList.add("hide")
        }
        getMealsBySerch(inputSearch.value)
    });

    inputSearch.addEventListener("keyup", (event) => {
        event.preventDefault();
        if (event.keyCode === 13) {
            searchBtn.click()

        }
    });



    randomMealBlock.addEventListener("click", (event) => event.target.classList.contains("img_btn") ? showInfoFromSearch(event) : addMealToFavFromSearch(event));

    popupMealBlock.addEventListener("click", (event) => {

        if (event.target.classList.contains("fa-youtube")) {
            showYoutube(event)
        }
        if (event.target.classList.contains("fa-heart")) {
            addMealToFavFromSearch(event)
        }
        if (event.target.classList.contains("fa-times")) {
            closepopup()
        }
    });

    categoriesBtn.addEventListener("click", () => showCategories());

    categoriesContainer.addEventListener("click", (event) => showMealsByCategory(event));

    mealsCategoryContainer.addEventListener("click", (event) => showInfoMealsCategory(event));
}
getRandomMeal()
checkIsFav()
fetchDataFromLS()
bindEvents()
























