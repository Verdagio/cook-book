import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';


import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { config } from '../../config/firebase-config';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private firebaseUrl = config.firebase.url;
  private firebaseAuth = config.firebase.auth;

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      `${this.firebaseUrl}recipes.json?${this.firebaseAuth}`, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes(){
    return this.http.get(`${this.firebaseUrl}recipes.json?${this.firebaseAuth}`)
    .pipe(map((recipes: Recipe[]) => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients || []};
      });
    }),
    tap((recipes: Recipe[]) => {
      this.recipeService.setRecipes(recipes);
    }));
  }
}
