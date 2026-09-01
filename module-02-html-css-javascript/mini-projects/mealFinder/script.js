const state={
  search:"",
  meals:[],
  favourites:[],
}

//doms

const searchForm=document.querySelector(".search-form");
const searchInput=document.getElementById("search-input");
const mealContainer=document.getElementById("meals");
const messageElement=document.querySelector("#message");
const favouriteContainer=document.querySelector(".favourite-meals");

//api

const API_URL="https://www.themealdb.com/api/json/v1/1/search.php?s="

function render(){
  const term=state.search.trim().toLowerCase();
  const meals=state.meals.filter((item)=>{
    return item.strMeal.toLowerCase().includes(term);

  })
  mealContainer.innerHTML=meals.map((item)=>creratedCard(item)).join("");
  favouriteContainer.innerHTML=state.favourites.map((item)=>creratedCard(item)).join("");
}

async function load(query){
  messageElement.textContent="Loading...";
  try{
    const response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

    const data=await response.json();
    state.meals=data.meals||[];
    messageElement.innerHTML="";
    console.log(data);
    render();

  }
  catch{
     messageElement.textContent="error"
  }
}

function creratedCard(meals){
  const saved=state.favourites.some((item)=>item.idMeal===meals.idMeal);
return`
 <div class="card"> 
 <img src="${meals.strMealThumb}" alt="${meals.strMeal}"></img>
 <div class="card_content">
  <h2> ${meals.strMeal}</h2>
  <button onclick="addOrRemove('${meals.idMeal}')">${saved? "remove": "favourite"}</button>
 
  </div>
 </div> `
}

searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const query=searchInput.value.trim();
  if(query){
    load(query);
  }
});

function addOrRemove(id){
  const exist=state.favourites.find((item)=>item.idMeal===String(id));
  if(exist){
    state.favourites=state.favourites.filter((item)=>item.idMeal !==String(id));
  }
  else{
    const item=state.meals.find((item)=>item.idMeal===String(id));
    state.favourites.push(item)
  }
  render();
  saveTofavourites();
  
}
function saveTofavourites(){
  localStorage.setItem("favourites", JSON.stringify(state.favourites))
}
function loadfavouriteMeals(){
  state.favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  
}

function init(){
  loadfavouriteMeals();
  load("chicken");
}
 init();
 

