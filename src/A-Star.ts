export interface Point {
  x: number;
  y: number;
}

const directionRow = [-1, +1, 0, 0];
const directionCol = [0, 0, +1, -1];
const start: Point = {x: 0, y: 0};
const end: Point = {x: 0, y: 20};
const openNodes: Array<Point> = new Array<Point>();
const closedNodes: Array<Point> = new Array<Point>();
const gCost: Array<Array<number>> = new Array<Array<number>>(30);
const hCost: Array<Array<number>> = new Array<Array<number>>(30);
const parents: Array<Array<Point>> = new Array<Array<Point>>(30);


const map = [
  ['X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['Y', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['W', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['W', 'W', 'W', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
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
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']];

let visited: boolean[][];
visited = new Array<Array<boolean>>(30);
for (let i = 0; i < 30; i++) {
  visited[i] = new Array<boolean>(30);
  gCost[i] = new Array<number>(30);
  hCost[i] = new Array<number>(30);
  parents[i] = new Array<Point>(30);
  for (let j = 0; j < visited[i].length; j++) {
    visited[i][j] = false;
    gCost[i][j] = 0;
    hCost[i][j] = 0;
    parents[i][j] = {x: -1, y: -1};
  }
}


openNodes.push(start);

while (openNodes.length > 0) {
  // console.log('--------------')
  // console.log(openNodes);
  // console.log(closedNodes);
  let currentPoint: Point = openNodes[0];
  // console.log('Outside Current Point');
  // console.log(currentPoint);
  for (let i = 0; i < openNodes.length; i++) {
    // console.log('test');
    // console.log('F Cost Nodes[i]=' + getFCost(openNodes[i]));
    // console.log('F Cost currentPoint=' + getFCost(currentPoint));
    // console.log('H Cost Nodes[i]=' + hCost[openNodes[i].x][openNodes[i].y]);
    // console.log('H Cost currentPoint=' + hCost[currentPoint.x][currentPoint.y]);
    if (getFCost(openNodes[i]) < getFCost(currentPoint) ||
      getFCost(openNodes[i]) === getFCost(currentPoint) &&
      hCost[openNodes[i].x][openNodes[i].y] < hCost[currentPoint.x][currentPoint.y]) {
      currentPoint = openNodes[i];
      // console.log('Inside Current Point');
      // console.log(currentPoint);
    }
  }
  openNodes.splice(openNodes.indexOf(currentPoint),1)
  // openNodes.filter((e1) => {
  //   return e1.x !== currentPoint.x && e1.y !== currentPoint.y;
  // });

  // console.log(openNodes);
  closedNodes.push(currentPoint);
  if (currentPoint.x === end.x && currentPoint.y === end.y) {
    console.log('Found');
    break;
  }else{
    console.log(currentPoint);
  }
  const neighbors: Array<Point> = getNeighbours(currentPoint);
  for (let i = 0; i < neighbors.length; i++) {
    if (contains(closedNodes, neighbors[i])) {
      continue;
    }

    const newMovCostToNeighbor = gCost[currentPoint.x][currentPoint.y] + getDistance(currentPoint, neighbors[i]);
    if (newMovCostToNeighbor < gCost[neighbors[i].x][neighbors[i].y] || !contains(openNodes, neighbors[i])) {
      gCost[neighbors[i].x][neighbors[i].y] = newMovCostToNeighbor;
      hCost[neighbors[i].x][neighbors[i].y] = getDistance(neighbors[i], end);
      parents[neighbors[i].x][neighbors[i].y] = {x: currentPoint.x, y: currentPoint.y};


      if (!contains(openNodes, neighbors[i])) {
        openNodes.push(neighbors[i]);
      }
    }
  }
}

function getNeighbours(p: Point): Array<Point> {
  const neighbors: Array<Point> = new Array<Point>();
  for (let i = 0; i < 4; i++) {
    const newR = p.x + directionRow[i];
    const newC = p.x + directionCol[i];
    if (newR < 0 || newC < 0) {
      // console.log('Out of bounds');
      continue;
    }
    if (newR >= map.length || newC >= map[0].length) {
      // console.log('Out of bounds');
      continue;
    }

    neighbors.push({x: newR, y: newC});
  }
  return neighbors;
}

function getFCost(p: Point): number {
  return gCost[p.x][p.y] + hCost[p.x][p.y];
}

function contains(neighbors: Array<Point>, n: Point) {
  let isThere = false;
  neighbors.forEach((e) => {
    // tslint:disable-next-line:triple-equals
    if (e.x == n.x && e.y === n.y) {
      isThere = true;
    }
  });
  return isThere;
}

function getDistance(nodeA: Point, nodeB: Point) {
  const dstX = Math.abs(nodeA.x - nodeB.x);
  const dstY = Math.abs(nodeA.y - nodeB.y);

  if (dstX > dstY) {
    return 14 * dstY + 10 * (dstX - dstY);
  }
  return 14 * dstX + 10 * (dstY - dstX);
}








