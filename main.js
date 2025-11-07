walls = [];
avoids = [];
raypos = [0,0];
raylen = [0,0,0]
var showraycasting = true;
var moveL = false;
var moveR = false;
var speed =2;
var closest = 1000;
var i;
rayamount = 8;
var keer = 1;
var roundd = 1;
var time1 = 0;
var time2= 0;
var time3= 0;
var time4= 0;
var time5= 0;
var besttime = 0;
var bestbrain;
var hudDecision = 0;
var renderOffsetX = 0;
var renderOffsetY = 0;


function setup() {
    var host = document.getElementById('canvas-host');
    var c = createCanvas(900, 700);
    if(host){ c.parent('canvas-host'); }
    // center rendering of the 400x400 grid (bounds 100..500) in the canvas
    renderOffsetX = (width/2) - ((100 + 500) / 2);
    renderOffsetY = (height/2) - ((100 + 500) / 2);
    walls.push(new Boundary(100, 100, 500, 100))
    walls.push(new Boundary(500, 100, 500, 500))
    walls.push(new Boundary(500, 500 ,100, 500))
    walls.push(new Boundary(100,500,100,100))
    walls.push(new Boundary(200, 200, 200, 400))
    walls.push(new Boundary(400,400,400,200))
    walls.push(new Boundary(400,200,200,200))
    walls.push(new Boundary(200,400,400,400))
    
    

    avoids.push(new Avoid(188,188,412,412))
    avoids.push(new Avoid(0,0,112,700))
    avoids.push(new Avoid(100,0,900,112))
    avoids.push(new Avoid(488,112,900,700))
    avoids.push(new Avoid(112,488,900,700))
    

    var image = loadImage('https://i.imgur.com/hD4yNyv.png');
    var image2 = loadImage('https://i.imgur.com/rmLMNEw.png');
    car = createSprite(
        250, 145);
        car.addImage('goed', image);
        car.addImage('fout', image2);
        car.addAnimation('goed', image)
    
    brain =  new NeuralNetwork(3,4,1)
    brain2 = new NeuralNetwork(3,4,1)
    brain3 = new NeuralNetwork(3,4,1)
    brain4 = new NeuralNetwork(3,4,1)
    brain5 = new NeuralNetwork(3,4,1)


    checkpoints = new Group();
    ch1 = createSprite(
        150, 200, 100, 1
    )
    ch2 = createSprite(
        450, 200, 100, 1
    )
    ch3 = createSprite(
        400, 450, 1, 100
    )
    ch4 = createSprite(
        150 ,400, 100, 1
    )
    //ch5 = createSprite(
    //    750, 400, 100,4
    //)
    checkpoints.add(ch1);
    checkpoints.add(ch2);
    checkpoints.add(ch3);
    checkpoints.add(ch4);
    // checkpoints.add(ch5);
    ch1.shapeColor = color(0, 225,0);
    ch2.shapeColor = color(0, 225,0);
    ch3.shapeColor = color(0, 225,0);
    // ch5.shapeColor = color(0, 225,0);
    ch4.shapeColor = color(0, 225,0);
    setInterval(time, 10)
    car.rotation = 0;
  }
  



  function draw(){
    //console.log(time1, time2,time3,time4,time5);
    background(11,15,23);
    push();
    translate(renderOffsetX, renderOffsetY);
    drawSprites();
    movement();
    // Update HUD
    updateHud();
    for (let wall of walls){
        wall.show();
    }
    for (let avoid of avoids){
        if (keyIsDown(DOWN_ARROW)) {
            avoid.show();
        }
        collision(avoid)
    }
    let a = 0
    for (i = 0;i <= rayamount;  i ++){
     let new_a = a + 360/rayamount;
     a = new_a;
     let ar = ((a % 360) + 360) % 360;
     let deg = Math.round(ar);
     // use only forward arc: keep <90° and >270°
     if (deg > 90 && deg < 270) { continue; }
     raycasting(a);
    }
    ga();
    pop();
  }
  function time(){
    if (keer == 1){
        time1 += 1;
        if (car.overlap(checkpoints)){
            time1 += 50;
            setTimeout(1000)
        }
    }
    if (keer == 2){
        time2+=1;
        if (car.overlap(checkpoints)){
            time2 += 50;
            setTimeout(1000)
        }
    }
    if (keer == 3){
        time3+=1;
        if (car.overlap(checkpoints)){
            time3 += 50;
            setTimeout(1000)
        }
    }
    if (keer == 4){
        time4+=1;
        if (car.overlap(checkpoints)){
            time4 += 50;
            setTimeout(1000)
        }
    }
    if (keer == 5){
        time5+=1;
        if (car.overlap(checkpoints)){
            time5 += 50;
            setTimeout(1000)
        }
    }
  }
  function updateHud(){
    var gEl = document.getElementById('hud-gen');
    var cEl = document.getElementById('hud-car');
    var sEl = document.getElementById('hud-score');
    var dEl = document.getElementById('hud-decision');
    if(gEl){ gEl.textContent = roundd; }
    if(cEl){ cEl.textContent = keer + '/5'; }
    if(sEl){ sEl.textContent = getCurrentScore() + '/' + besttime; }
    if(dEl){ dEl.textContent = hudDecision + '/10'; }
  }

  function getCurrentScore(){
    if (keer == 1) return time1;
    if (keer == 2) return time2;
    if (keer == 3) return time3;
    if (keer == 4) return time4;
    if (keer == 5) return time5;
    return 0;
  }
  function collision(m){
      if (car.position.x > m.a.x && car.position.x < m.b.x){
          if(car.position.y > m.a.y && car.position.y < m.b.y){
              if (keer ==5){
                  roundd +=1 
                  keer = 0
              }
              keer += 1;
              car.rotation = 0;
              car.position.x = 250;
              car.position.y = 145;
              mutation();
          }
      }
  }
  function movement(){
        if (keyIsDown(LEFT_ARROW)) {
            moveL = true;
        } else if (keyIsDown(RIGHT_ARROW)) {
            moveR = true;
        }
        if (moveR == true) {
        car.rotation += speed;
        moveR = false;
        }
        if (moveL == true)  {
        car.rotation -= speed;
        moveL = false;
        }
        car.position.x += speed * Math.cos(car.rotation * Math.PI / 180);
        car.position.y += speed * Math.sin(car.rotation * Math.PI / 180);
    }
  function raycasting(angle){
    closest = 1000;
    for (let wall of walls){
        berkpunt(wall , angle);
    }
    stroke(255)
    line((Math.cos((angle+car.rotation)*Math.PI/180 ) * 0) + car.position.x, (Math.sin((angle+car.rotation)*Math.PI/180 ) * 0) + car.position.y, raypos[0], raypos[1])
  }
  function berkpunt(m, r){
    var pt;
    newAngle = car.rotation + r;
    if (newAngle > 360){
        newAngle -= 360;
    }
    if (newAngle < 0){
        newAngle += 360
    } 
    const x1 = m.a.x;
    const y1 = m.a.y;
    const x2 = m.b.x;
    const y2 = m.b.y;
    const x3 = (Math.cos(newAngle *Math.PI/180 ) * 15) + car.position.x;
    const y3 = (Math.sin(newAngle *Math.PI/180 ) * 15) + car.position.y;
    const x4 = (Math.cos(newAngle *Math.PI/180 ) * 10000) + car.position.x;
    const y4 = (Math.sin(newAngle *Math.PI/180 ) * 10000) + car.position.y;
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
    return pt;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
    const pt = createVector();
    var d_x = 0;
    var d_y = 0;
    pt.x = x1 + t * (x2 - x1);
    pt.y = y1 + t * (y2 - y1);
    if (pt.x >= x3){
        d_x = pt.x - x3;
    }
    else if (x3 >= pt.x){
        d_x = x3 - pt.x
    }
    if (pt.y >= y3){
        d_y = pt.y - y3
    } 
    else if (y3 >= pt.y){
        d_y = y3 - pt.y;
    }
    lengte = Math.sqrt((d_y*d_y)+(d_x*d_x));
    if (lengte <= closest){
        closest = lengte;
            raypos[0] = pt.x;
            raypos[1] = pt.y;
            // map front-left, front, front-right to 3 inputs
            var rel = ((r % 360) + 360) % 360;
            if (rel < 90 || rel > 270){
                if (rel < 45 || rel > 315){
                  raylen[1] = lengte; // front
                } else if (rel <= 90){
                  raylen[2] = lengte; // front-right
                } else if (rel >= 270){
                  raylen[0] = lengte; // front-left
                }
            }
    }}}
  function ga(){
     //movement
                if (keer == 1){
                //console.log(speed);
                output = brain.predict(raylen);
                }
                if (keer == 2){
                output = brain2.predict(raylen);
                }
                if (keer == 3){
                output = brain3.predict(raylen);
                }
                if (keer == 4){
                output = brain4.predict(raylen); 
                }
                if (keer == 5){
                output = brain5.predict(raylen); 
                }
                if (output > 0.55){
                    moveL = 1;
                }
                if (output < 0.45){
                    moveR = 1;
                }
                // decision score is 0..10
                hudDecision = Math.round(output * 10);
  }
  function mutatee(x) {
    if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
    } else {
    return x;
    }
}
  function mutation(){
        if (time1 > time2 && time1 > time3 && time1 > time4 && time1 > time5 && time1 > besttime){
             bestbrain = brain;
             besttime = time1;
        }
        if (time2 > time1 && time2 > time3 && time2 > time4 && time2 > time5&& time2 > besttime){
            bestbrain = brain2;
            besttime = time2
        }
        if (time3 > time2 && time3 > time1 && time3 > time4 && time3 > time5&& time3 > besttime){
            bestbrain = brain3;
            besttime = time3
        }
        if (time4 > time2 && time4 > time3 && time4 > time1 && time4 > time5&& time4 > besttime){
            bestbrain = brain4;
            besttime = time4
        }
        if (time5 > time2 && time5 > time3 && time5 > time4 && time5 > time1&& time5 > besttime){
            bestbrain = brain5;
            besttime = time5
        }
        time1 = 0;
        time2 = 0;
        time3 = 0;
        time4 = 0;
        time5 = 0;
        brain  = bestbrain.copy();
        brain.mutate(mutatee)
        brain2 = bestbrain.copy();
        brain2.mutate(mutatee)
        brain3 = bestbrain.copy();
        brain3.mutate(mutatee)
        brain4 = bestbrain.copy();
        brain4.mutate(mutatee)
        brain5 = bestbrain.copy();
        brain5.mutate(mutatee)
  }