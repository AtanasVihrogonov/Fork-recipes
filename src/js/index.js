import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/*******************
 * SEARCH CONTROLLER
 ********************/
const controlSearch = async() => {
  // 1. Get the query from view
  const query = searchView.getInput();
  //console.log(query);
 
  if (query) {
    // 2. New search object and added state
    state.search = new Search(query);

    // 3. Prepare UI for results(clear previous result or show a loading spiner)
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipes
      await state.search.getResults();
  
      // 5. Render results om UI
      clearLoader();
      //console.log(state.search.result);
      searchView.renderResults(state.search.result);
    } catch (error) {
      error('Something wrong with the error!');
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);  // 10 --> base of the number
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
})

/*******************
 * RECIPE CONTROLLER
 ********************/
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // 1.Prepare UI for changes

    // 2.Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // 3.Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      //console.log(state.replace.ingredients);
      state.recipe.parseIngredients();
  
      // 4.Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
  
      // 5.Render recipe
      console.log(state.recipe);
    } catch (alert) {
      alert('Error processing!');
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
