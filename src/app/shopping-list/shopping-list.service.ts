import { Injectable, EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  ingredientsUpdated = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Salt', 15),
    new Ingredient('Strong white Flour', 500),
    new Ingredient('Yeast', 7),
    new Ingredient('Warm Water', 350),
    new Ingredient('Sugar', 10),
    new Ingredient('Aromat', 5)
  ];

  constructor(private loggingService: LoggingService) { }

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsUpdated.emit(this.ingredients.slice());
    //this.loggingService.logMessage(`Added ingredient ${ingredient.name} to shopping list`);
  }

  addIngredients(newIngredients: Ingredient[]){

    newIngredients.forEach(ingredient =>{
      var index = this.ingredients.findIndex(item => item.name === ingredient.name);
      if(index > -1){
        this.ingredients[index].amount += ingredient.amount;
        //this.loggingService.logMessage(`Updated ${ingredient.name} to amount: ${ingredient.amount}`);
      } else {
        this.addIngredient(ingredient);
      }
    });
    this.ingredientsUpdated.emit(this.ingredients.slice());

  }

  // removeIngredient(id: number){
  //   this.ingredients.splice(id, 1);
  // }

  updateIngredient(id: number, ingredient: Ingredient){
    this.ingredients[id] = ingredient;
    //this.loggingService.logMessage(`Ingredient ${ingredient.name} updated`);
  }
}
