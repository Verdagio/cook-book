import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';


import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { config } from '../../config/firebase-config';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private firebaseUrl = config.firebase.url;
  private firebaseAuth = config.firebase.auth;

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      `${this.firebaseUrl}recipes.json?`, recipes).subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {

    return this.http.get(`${this.firebaseUrl}recipes.json`)
      .pipe(
        map((recipes: Recipe[]) => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients || [] };
          });
        }),
        tap((recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
