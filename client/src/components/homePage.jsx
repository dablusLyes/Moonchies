import React from "react";
import Recipelist from "./recipeList";
import Searchbar from "./searchBar";
import { useState, useEffect, useReducer } from "react";
import axios from "axios";

const Homepage = () => {
  const [ingridients, setIngridients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isContentOnPage, setIsContentOnPage] = useState(false)
  const [sortMethod, setSortMethod] = useState('')

  const sortRecipes = (sortMethod) => {
    switch (sortMethod) {
      case 'Alphabetical':
        recipes.sort((recipe1, recipe2) => recipe1.title > recipe2.title ? 1 : -1)
        break;
      case 'Likes':
        recipes.sort((recipe1, recipe2) => recipe1.likes > recipe2.likes ? 1 : -1)
        break;
      case 'IngredientsMissing':
        recipes.sort((recipe1, recipe2) => recipe1.missedIngredients.length < recipe2.missedIngredients.length ? 1 : -1)
        break;
      default:
        break;
    }
  }

  const search = (obj) => {
    setIngridients(obj);
  };

  const getRecipes = async (searchObj) => {
    axios
      .post("http://localhost:5000/api", searchObj)
      .then((res) => {
        return setRecipes(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (ingridients.searchText) {
      getRecipes(ingridients);
    }
  }, [ingridients]);


  useEffect(() => {
    if (recipes.length === 0) setIsContentOnPage(false)
    else setIsContentOnPage(true)
  }, [recipes])


  return (
    <div className="App">
      {!isContentOnPage &&
        <div className=" py-10 mt-10 flex justify-center text-5xl">
          <h1 className="moonchies flex justify-end">Moon<img className="w-10 " src="/cookie-com.svg" alt="" />hies</h1>
        </div>
      }

      <Searchbar search={search} isContentOnPage={isContentOnPage} />


      <p className='p-2 text-textLight'>Filter :</p>
      <div className="filter-container bg-cta inline p-2  mx-4 rounded-xl">
        <input onChange={setSortMethod('Alphabetical')} htmlFor="Alphabetical" type="radio" className='hidden' />
        <label htmlFor="Alphabetical"> 🔤 </label>

        <input htmlFor="Likes" type="radio" className='hidden' />
        <label htmlFor="Likes">💓</label>

        <input htmlFor="IngredientsMissing" type="radio" className='hidden' />
        <label htmlFor="IngredientsMissing"> 🥨 </label>
      </div>

      {recipes ? <Recipelist recipes={recipes} /> : <p>Nothing found 😿</p>}
    </div>
  );
};

export default Homepage;
