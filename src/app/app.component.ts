import {Component, OnInit, ViewEncapsulation} from '@angular/core';
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

enum availableAlgorithms {
  bfs = 'BFS',
  dfs = 'DFS'
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public message: AppMesssageService) {
    this.animationsPath = new Array<Point>();
    this.wallPaths = new Array<Point>();
    this.mapData = new Array<Array<string>>(this.Rows);
    for (let i = 0; i < this.Rows; i++) {
      this.mapData[i] = new Array<string>(this.Column);
      for (let j = 0; j < this.Column; j++) {
        this.mapData[i][j] = ' ';
      }
    }
    for (let i = 0; i < this.Rows; i++) {
      this.visited[i] = new Array<boolean>(this.Column);
      for (let j = 0; j < this.Column; j++) {
        this.visited[i][j] = false;
      }
    }
    this.resetActualPath();
  }

  selectedAlgorithm: availableAlgorithms = availableAlgorithms.bfs;
  animationsPath: Array<Point>;
  wallPaths: Array<Point>;
  actualPath: Array<Array<Point>>;

  running = false;
  Rows = 50;
  Column = 60;


  isWallMode = false;
  mousedown = false;
  list = null;
  resetBtn = null;
  searchBtn = null;

  diagonalStepsAllowed = false;
  found = false;
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

  mapData: Array<Array<string>>;

  directionRow = [-1, +1, 0, 0, -1, -1, +1, +1];
  directionCol = [0, 0, +1, -1, -1, +1, +1, -1];

  visited: boolean[][] = new Array<Array<boolean>>(this.Rows);

  dfsFound = false;


  BFS(map: string[][], start: Point, end: Point) {
    this.found = false;
    const rowQueue: Array<number> = new Array<number>();
    const colQueue: Array<number> = new Array<number>();
    const sr = start.x;
    const sc = start.y;

    const R = map.length;
    const C = map[0].length;
    /*const visited: boolean[][] = new Array<Array<boolean>>(R);
    for (let i = 0; i < R; i++) {
      visited[i] = new Array<boolean>(C);
      for (let j = 0; j < C; j++) {
        visited[i][j] = false;
      }
    }*/

    let reached = false;
    rowQueue.push(sr);
    colQueue.push(sc);
    this.visited[sr][sc] = true;
    while (rowQueue.length > 0 && colQueue.length > 0) {
      const tempR: number = rowQueue.shift();
      const tempC: number = colQueue.shift();
      this.animationsPath.push({x: tempR, y: tempC});
      // if (map[tempR][tempC] === 'Y') {
      if (tempR === end.x && tempC === end.y) {
        reached = true;
        // console.log(`Found at ${tempR}:${tempC}`);
        this.found = true;
        break;
      }
      this.getNeighboursOfCell(map, tempR, tempC, R, C, this.visited, rowQueue, colQueue);
    }
    this.visualize(this.animationsPath);
    // this.colorPath(this.actualPath, undefined, i);

  }


  getNeighboursOfCell(map: string[][], tempR: number, tempC: number, R: number, C: number,
                      visited: Array<Array<boolean>>, rQ: Array<number>, cQ: Array<number>) {
    let newR = -1;
    let newC = -1;
    const steps = (this.diagonalStepsAllowed) ? 8 : 4;
    for (let i = 0; i < steps; i++) {
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
      this.actualPath[newR][newC] = {x: tempR, y: tempC};
    }
  }


  visualize(path: Array<Point>) {
    // tslint:disable-next-line:prefer-for-of
    let final = 0;
    for (let i = 0; i < path.length; i++) {
      this.color(i).then(() => {
        this.list.children[path[i].x].children[path[i].y].classList.add('node-visited');
      });
      final = i;
    }
    let count = 5;
    // console.log(`Final:${final}`);
    let currentPoint = {x: this.dest.x, y: this.dest.y};

    while (currentPoint.x !== -1 && currentPoint.y !== -1) {

      this.colorPath(currentPoint, count, final);
      count += 5;
      currentPoint = this.actualPath[currentPoint.x][currentPoint.y];
    }

    if (!this.found) {
      console.log('Not Found ---------------');
      setTimeout(() => {
        $('#modalFailure').modal();
      }, (count * 10) + (final * this.speedValue));
    }
  }

  colorPath(currentPoint: Point, count: number, offset: number) {
    setTimeout(() => {
      // console.log(currentPoint);
      this.list.children[currentPoint.x].children[currentPoint.y].classList.add('path');
      this.list.children[currentPoint.x].children[currentPoint.y].classList.remove('node-visited');
      if (this.actualPath[currentPoint.x][currentPoint.y].x === -1) this.running = false;
    }, (count * 10) + (offset * this.speedValue));
  }

  color(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, this.speedValue * time);
    });
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
    me.resetBtn = $('#reset-btn');
    me.searchBtn = $('#search-btn');


    this.resetBtn.click((event) => {
      this.found = false;
      event.preventDefault();
      this.animationsPath = new Array<Point>();
      this.actualPath = new Array<Array<Point>>();
      this.resetActualPath();

      this.clearWalls(this.wallPaths);
      if (this.source.object && this.source.object.classList.contains('bg-success')) {
        this.clearSource();
      }
      if (this.dest.object && this.dest.object.classList.contains('bg-dark')) {
        this.clearDest();
      }
      for (let i = 0; i < this.Rows; i++) {
        this.visited[i] = new Array<boolean>(this.Column);
        for (let j = 0; j < this.Column; j++) {
          this.visited[i][j] = false;
        }
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
          if (this.list.children[i].children[j].classList.contains('path')) {
            this.list.children[i].children[j].classList.remove('path');
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
      this.animationsPath = new Array<Point>();
      this.actualPath = new Array<Array<Point>>();
      this.resetActualPath();
      for (let i = 0; i < me.list.children.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < me.list.children[i].children.length; j++) {
          if (this.list.children[i].children[j].classList.contains('highlight')) {
            this.list.children[i].children[j].classList.remove('highlight');
          }
          if (this.list.children[i].children[j].classList.contains('node-visited')) {
            this.list.children[i].children[j].classList.remove('node-visited');
          }
          if (this.list.children[i].children[j].classList.contains('path')) {
            this.list.children[i].children[j].classList.remove('path');
          }
        }
      }
      for (let i = 0; i < this.Rows; i++) {
        this.visited[i] = new Array<boolean>(this.Column);
        for (let j = 0; j < this.Column; j++) {
          this.visited[i][j] = false;
        }
      }
      this.running = true;
      if (this.selectedAlgorithm === availableAlgorithms.bfs) {
        this.BFS(this.mapData, {x: this.source.x, y: this.source.y}, {x: this.dest.x, y: this.dest.y});
      } else {
        this.startDfs(this.source);
      }
    });
    $('#options-dropdown > .dropdown-toggle').html(me.mode);
    $('#options-dropdown > .dropdown-menu > .dropdown-item').click(function test() {
      me.mode = $(this).attr('value');
      // console.log(me.mode);
      $('#options-dropdown > .dropdown-toggle').html(me.mode);

    });


    $('#options-speed > .dropdown-toggle').html('Speed ' + me.speed);
    $('#options-speed > .dropdown-menu > .dropdown-item').click(function test() {
      me.speed = $(this).attr('value');
      // console.log(me.speedValue);
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
            event.target.classList.add('wall');
            this.mapData[i][j] = 'W';
            this.wallPaths.push({x: i, y: j});
          }
        });
        this.list.children[i].children[j].addEventListener('mousedown', (event) => {
          event.preventDefault();
          if (this.isWallMode) {
            this.mousedown = true;
          }
        });
        $(this.list.children[i].children[j]).click(function (event) {
          const data = this.value.split(':');
          // tslint:disable-next-line:radix
          const row = parseInt(data[0]);
          // tslint:disable-next-line:radix
          const column = parseInt(data[1]);
          // console.log(`${row}:${column}`);
          if (me.mode === 'Source' && !this.classList.contains('wall')) {
            this.classList.add('bg-success');
            this.classList.add('animate__animated');
            this.classList.add('animate__headShake');
            if (me.source.object && me.source.object.classList.contains('bg-success')) {
              me.clearSource();
            }
            me.source.object = this;
            me.source.x = row;
            me.source.y = column;

          } else if (!this.classList.contains('wall')) {
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
  }

  clearWalls(walls: Array<Point>) {
    for (const point of walls) {
      this.mapData[point.x][point.y] = ' ';
    }
    this.wallPaths = new Array<Point>();
  }

  resetActualPath() {
    this.actualPath = new Array<Array<Point>>(this.mapData.length);
    for (let i = 0; i < this.actualPath.length; i++) {
      this.actualPath[i] = new Array<Point>(this.mapData[0].length);
      for (let j = 0; j < this.actualPath[i].length; j++) {
        this.actualPath[i][j] = {x: -1, y: -1};

      }
    }
  }

  onDiagonalModeClicked(checked: boolean) {
    this.diagonalStepsAllowed = checked;
    // console.log(this.diagonalStepsAllowed);
  }

  generateRandomObstacles(genRandom: MouseEvent, howMuch: number) {
    genRandom.preventDefault();

    let xx;
    let yy;

    for (let i = 0; i < howMuch; i++) {
      xx = Math.floor(Math.random() * ((this.Rows - 1) + 1));
      yy = Math.floor(Math.random() * ((this.Column - 1) + 1));

      if (this.source.x === xx && this.source.y === yy) {
        continue;
      }

      if (this.dest.x === xx && this.dest.y === yy) {
        continue;
      }

      this.wallPaths.push({x: xx, y: yy});
      this.mapData[xx][yy] = 'W';
      this.list.children[xx].children[yy].classList.add('wall');
    }
  }

  algoChange(algo: string) {
    if (algo === availableAlgorithms.bfs) {
      this.selectedAlgorithm = availableAlgorithms.bfs;
    } else if (algo === availableAlgorithms.dfs) {
      this.selectedAlgorithm = availableAlgorithms.dfs;
    }
    console.log(this.selectedAlgorithm);
  }

  DFS(cell) {

    // printMap();
    // console.log('\n\n\n');

    // if (start.x === end.x && start.y === end.y) {
    //   return;
    // }
    if (this.dfsFound) {
      return;
    }
    const steps = (this.diagonalStepsAllowed) ? 8 : 4;
    // let tempDirX = this.shuffle(this.directionRow);
    // let tempDirY = this.shuffle(this.directionCol);
    for (let i = 0; i < steps && !this.dfsFound; i++) {
      const newR = cell.x + this.directionRow[i];
      const newC = cell.y + this.directionCol[i];
      // console.log(`AT: ${cell.x}:${cell.y}`);
      // console.log(`Trying: ${newR}:${newC}`);
      // IF OUT OF BOUNDS
      if (newR < 0 || newC < 0) {
        // console.log('Out of bounds');
        continue;
      }
      if (newR >= this.mapData.length || newC >= this.mapData[0].length) {
        // console.log('Out of bounds');
        continue;
      }
      // IF WALL ENCOUNTERED OR VISITED

      if (this.visited[newR][newC]) {
        // console.log('visited');
        continue;
      }
      if (this.mapData[newR][newC] === 'W') {
        // console.log('isWall');
        continue;
      }
      if (newR === this.dest.x && newC === this.dest.y) {
        console.log(`Found at: ${newR}:${newC}`)
        this.found = true;
        // console.log('Found');
        // continue;
        this.dfsFound = true;
      }

      // stack.push({x: newR, y: newC});
      this.visited[newR][newC] = true;
      this.actualPath[newR][newC] = {x: cell.x, y: cell.y};
      this.animationsPath.push({x: cell.x, y: cell.y});
      // console.log(`Discovered: ${newR}:${newC}`);

      // console.log(`Calling for: ${newR}:${newC}`)
      this.DFS({x: newR, y: newC});

    }
  }

  startDfs(start: Point) {
    this.dfsFound = false;
    this.visited[start.x][start.y] = true;
    this.DFS(start);
    this.visualize(this.animationsPath);
    // console.log(this.animationsPath);
    // console.log(this.actualPath);
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

}
