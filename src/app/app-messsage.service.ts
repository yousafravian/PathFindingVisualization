import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppMesssageService {

  coordinates: Subject<{ x: number, y: number }>;

  constructor() {
    this.coordinates = new Subject<{x: number, y: number}>();
  }

  announcecoordinates(x: number, y: number) {
    this.coordinates.next({x, y});
  }
}
