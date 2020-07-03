import {Component, OnInit, ViewChild} from '@angular/core';
import {AppMesssageService} from './app-messsage.service';

declare var $: any;

export interface Point {
  x: number;
  y: number;
}

enum Speed {
  Slow = 'Slow',
  Normal = 'Normal',
  Fast = 'Fast'

}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  path: Array<Point>;
  wallPaths: Array<Point>;

  title = 'ai-project';


  isWallMode = false;
  mousedown = false;
  list = null;
  resetBtn = null;
  searchBtn = null;

  mode = 'Source';
  speed = Speed.Normal;
  speedValue = 25;

  source = {
    object: null,
    x: null,
    y: null
  };
  dest = {
    object: null,
    x: null,
    y: null
  };

  mapData = [
    ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'O', ' ', ' ', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'O', ' ', 'O', ' ', ' ', 'O', ' ', 'O', ' ', 'O', ' ', 'O', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Y']];
  directionRow = [-1, +1, 0, 0];
  directionCol = [0, 0, +1, -1];

  Algo(map: string[][], start: Point, end: Point) {
    const rowQueue: Array<number> = new Array<number>();
    const colQueue: Array<number> = new Array<number>();
    const sr = start.x;
    const sc = start.y;
    const change = false;


    const R = map.length;
    const C = map[0].length;
    const visited: boolean[][] = new Array<Array<boolean>>(R);
    for (let i = 0; i < R; i++) {
      visited[i] = new Array<boolean>(C);
      for (let j = 0; j < C; j++) {
        visited[i][j] = false;
      }
    }

    let reached = false;
    rowQueue.push(sr);
    colQueue.push(sc);
    visited[sr][sc] = true;
    while (rowQueue.length > 0 && colQueue.length > 0) {
      const tempR: number = rowQueue.shift();
      const tempC: number = colQueue.shift();
      this.path.push({x: tempR, y: tempC});
      // if (map[tempR][tempC] === 'Y') {
      if (tempR === end.x && tempC === end.y) {
        reached = true;
        console.log(`Found at ${tempR}:${tempC}`);
        break;
      }
      this.getNeighboursOfCell(map, tempR, tempC, R, C, visited, rowQueue, colQueue);
    }
    this.visualize(this.path);

  }

  getNeighboursOfCell(map: string[][], tempR: number, tempC: number, R: number, C: number,
                      visited: Array<Array<boolean>>, rQ: Array<number>, cQ: Array<number>) {
    let newR = -1;
    let newC = -1;
    for (let i = 0; i < 4; i++) {
      newR = tempR + (this.directionRow)[i];
      newC = tempC + (this.directionCol)[i];
      // IF OUT OF BOUNDS
      if (newR < 0 || newC < 0) {
        continue;
      }
      if (newR >= R || newC >= C) {
        continue;
      }
      // IF WALL ENCOUNTERED OR VISITED
      if (visited[newR][newC]) {
        continue;
      }
      if (map[newR][newC] === 'W') {
        continue;
      }
      // ADD NEW CELL TO QUEUE
      rQ.push(newR);
      cQ.push(newC);
      visited[newR][newC] = true;
    }
  }

  sleep(seconds) {
    const e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) {
    }
  }

  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async visualize(path: Array<Point>) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < path.length; i++) {
      this.color(i).then(() => {
        this.list.children[path[i].x].children[path[i].y].classList.add('node-visited');
      });
    }
  }

  color(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, this.speedValue * time);
    });
  }

  constructor(public message: AppMesssageService) {
    this.path = new Array<Point>();
    this.wallPaths = new Array<Point>();
  }

  clearDest() {
    this.dest.object.classList.remove('bg-dark');
    this.dest.object.classList.remove('animate__animated');
    this.dest.object.classList.remove('animate__headShake');
    this.dest.object = null;
    this.dest.x = null;
    this.dest.y = null;
  }

  clearSource() {
    this.source.object.classList.remove('bg-success');
    this.source.object.classList.remove('animate__animated');
    this.source.object.classList.remove('animate__headShake');
    this.source.object = null;
    this.source.x = null;
    this.source.y = null;
  }

  ngOnInit(): void {


    const me = this;
    me.list = document.getElementById('tbody');
    console.log(me.list);
    me.resetBtn = $('#reset-btn');
    me.searchBtn = $('#search-btn');


    this.resetBtn.click((event) => {
      event.preventDefault();
      this.path = new Array<Point>();
      this.clearWalls(this.wallPaths);
      console.log(this.path);
      if (this.source.object && this.source.object.classList.contains('bg-success')) {
        this.clearSource();
      }
      if (this.dest.object && this.dest.object.classList.contains('bg-dark')) {
        this.clearDest();
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < me.list.children.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < me.list.children[i].children.length; j++) {
          if (this.list.children[i].children[j].classList.contains('highlight')) {
            this.list.children[i].children[j].classList.remove('highlight');
          }
          if (this.list.children[i].children[j].classList.contains('node-visited')) {
            this.list.children[i].children[j].classList.remove('node-visited');
          }
          if (this.list.children[i].children[j].classList.contains('wall')) {
            this.list.children[i].children[j].classList.remove('wall');
          }
        }
      }
    });
    this.searchBtn.click(event => {
      event.preventDefault();
      if (!this.source.object || !this.dest.object) {
        $('#modelId').modal();
        return;
      }
      console.log(this.source);
      console.log(this.dest);
      // this.Algo(this.mapData, {x: 0, y: 1}, {x: 5, y:10});
      this.Algo(this.mapData, {x: this.source.x, y: this.source.y}, {x: this.dest.x, y: this.dest.y});
    });
    $('#options-dropdown > .dropdown-toggle').html(me.mode);
    $('#options-dropdown > .dropdown-menu > .dropdown-item').click(function test() {
      me.mode = $(this).attr('value');
      console.log(me.mode);
      $('#options-dropdown > .dropdown-toggle').html(me.mode);

    });


    $('#options-speed > .dropdown-toggle').html('Speed ' + me.speed);
    $('#options-speed > .dropdown-menu > .dropdown-item').click(function test() {
      me.speed = $(this).attr('value');
      console.log(me.speedValue);
      $('#options-speed > .dropdown-toggle').html('Speed ' + me.speed);

      switch (me.speed) {
        case 'Slow':
          me.speedValue = 50;
          break;
        case 'Normal':
          me.speedValue = 25;
          break;
        case 'Fast':
          me.speedValue = 10;
          break;
        default:
          me.speedValue = 25;
      }
    });


    document.body.onmouseup = () => {
      this.mousedown = false;
    };
    for (let i = 0; i < me.list.children.length; i++) {
      for (let j = 0; j < me.list.children[i].children.length; j++) {
        // console.log()
        $(this.list.children[i].children[j]).val(i + ':' + j);


        this.list.children[i].children[j].addEventListener('mouseenter', (event) => {
          if (this.mousedown) {
            console.log('Enter Held' + event.target.classList.add('wall'));
            this.mapData[i][j] = 'W';
            this.wallPaths.push({x: i, y: j});
          }
        });
        this.list.children[i].children[j].addEventListener('mousedown', () => {
          if (this.isWallMode) {
            this.mousedown = true;
          }
        });
        $(this.list.children[i].children[j]).click(function(event) {
          const data = this.value.split(':');
          // tslint:disable-next-line:radix
          const row = parseInt(data[0]);
          // tslint:disable-next-line:radix
          const column = parseInt(data[1]);
          console.log(`${row}:${column}`);
          if (me.mode === 'Source') {
            this.classList.add('bg-success');
            this.classList.add('animate__animated');
            this.classList.add('animate__headShake');
            if (me.source.object && me.source.object.classList.contains('bg-success')) {
              me.clearSource();
            }
            me.source.object = this;
            me.source.x = row;
            me.source.y = column;

          } else {
            this.classList.add('bg-dark');
            this.classList.add('animate__animated');
            this.classList.add('animate__headShake');
            if (me.dest.object && me.dest.object.classList.contains('bg-dark')) {
              me.clearDest();
            }
            me.dest.object = this;
            me.dest.x = row;
            me.dest.y = column;
          }
        });

      }
    }


  }

  checkWall(checked: boolean) {
    this.isWallMode = checked;
    console.log(checked);
  }

  clearWalls(walls: Array<Point>) {
    for (const point of walls) {
      this.mapData[point.x][point.y] = ' ';
    }
    this.wallPaths = new Array<Point>();
  }
}
