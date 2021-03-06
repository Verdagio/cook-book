import { Injectable, } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from '../shared/ingredient.model';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'Pizza',
    //   'Crispy and Fluffy',
    //   'https://img.bestrecipes.com.au/_NxEuA7v/br/2017/05/super-easy-pizza-dough-recipe-520771-1.jpg',
    //   [
    //     new Ingredient('Salt', 15),
    //     new Ingredient('Strong white Flour', 500),
    //     new Ingredient('Yeast', 7),
    //     new Ingredient('Warm Water', 350),
    //     new Ingredient('Sugar', 10),
    //     new Ingredient('Aromat', 5)
    //   ]),
    // new Recipe(
    //   'Chilli',
    //   'Spicy and Smokey',
    //   'https://asset.slimmingworld.co.uk/content/media/11596/jackfruit-chilli-iceland_sw_recipe.jpg?v1=JGXiore20qg9NNIj0tmc3TKfKw-jr0s127JqqpCA2x7sMviNgcAYh1epuS_Lqxebn9V_qusKHfwbF7MOUrAPptzBhXIUL1Xnq2Mmdvx4fOk&width=552&height=552',
    //   [
    //     new Ingredient('Salt', 15),
    //     new Ingredient('Chopped Tomatoes', 500),
    //     new Ingredient('Chilli Powder', 40),
    //     new Ingredient('Warm Water', 300),
    //     new Ingredient('Chipotle chilli flakes', 10),
    //     new Ingredient('Kidney Beans', 300)
    //   ])
  ];

  constructor(private shoppingListService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(index: number): Recipe {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe){
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  addToShoppingList(ingredients: Ingredient[]){
    this.shoppingListService.addIngredients(ingredients);
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
