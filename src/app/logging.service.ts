import { Injectable } from '@angular/core';

export class LoggingService {

  // this would Ideally log errros and events to a log file but for now the console will do
  logMessage(message: string){
    console.log(message);
  }

  constructor() { }
}
