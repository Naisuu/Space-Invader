var canvas = document.getElementById('game_area');
    var context = canvas.getContext('2d');


    // Merci Audic pour m'avoir donné l'idée de faire une classe pour les ennemis
    // Class permettant de dessiner les aliens et de les fairent bouger et permet aussi de gérer les ennemis lorsqu'ils touchent les bords du canvas
    class Alien{
      constructor(x,y,width,height,vitesse_x,vitesse_y){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.vitesse_x = vitesse_x;
      this.vitesse_y = vitesse_y;
      this.isColliding = false;
      this.statut = true;
      }
      
      DrawAlien(){
        if(this.statut == true){
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height);          
      }
      }

      updateAliens(){
        var alien = aliens[i];
        if(alien.x < 0){
          alien.x = 0;
          this.vitesse_x = -this.vitesse_x;
        }
        if(alien.x > canvas.height-this.width){
          alien.x = canvas.height-this.width;
          this.vitesse_x = -this.vitesse_x;
        }
        if (alien.y < 0){
          alien.y = 0;
          this.vitesse_y = -this.vitesse_y + (0.10 * -this.vitesse_y);
        }
        if (alien.y > canvas.height-this.height){
          alien.y = canvas.height-this.height;
          this.vitesse_y = -this.vitesse_y + (0.10 * -this.vitesse_y);
        }
        alien.x += this.vitesse_x;
        alien.y += this.vitesse_y
      }

    }

    var aliens = []
    var nb_alien = 100
    var c = 0

    for(i = 0; i < nb_alien; i++){
      random_alien = new Alien(Math.floor(Math.random() * 501), Math.floor(Math.random() * 300),
      10, 10, 2, 1);
      aliens.push(random_alien);
    }
    
    
    var spaceship = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 32,
    height: 32,
    counter: 0,
    collision: false,
    statut: true
    };

    var keyboard = {};

    var lasers = [];


    function drawBackground() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    }


    function gameLoop() {
    // Mise à jour du programme
    
    if(spaceship.statut == true){
    drawBackground();
    drawSpaceship();
    drawCanon();
    updateSpaceship();
    updateLasers();
    drawLasers();      
    for(i = 0; i < aliens.length; i++){
      aliens[i].DrawAlien();
      aliens[i].updateAliens();
    }
    collDetection();
    spaceshipColl();
    laserColl();
    }
    if(spaceship.statut == false){
    drawBackground();
    spaceship = {};
    lasers = [];
    laser = {};
    aliens = [];
    drawLosingScreen();
    }
    if(c == nb_alien){
      drawBackground();
      spaceship = {};
      lasers = [];
      laser = {};
      aliens = [];
      drawWinningScreen();
    }     
    }

    addKeyboardEvents();
    setInterval(gameLoop, 1000 / 60);


    function drawLosingScreen(){
      context.font = "30px Arial"
      context.fillStyle = 'white'
      context.fillText('Perdu !', canvas.width/2, canvas.height/2)
    }

    function drawWinningScreen(){
      context.font = "30px Arial"
      context.fillStyle = 'white'
      context.fillText('Gagné !', canvas.width/2, canvas.height/2)      
    }


    function drawSpaceship() {
    context.fillStyle = "white";
    context.fillRect(spaceship.x, spaceship.y, spaceship.width,  spaceship.height);      
    }


    function drawCanon(){    
    context.fillStyle = 'blue'
    context.fillRect(spaceship.x+10, spaceship.y-10,spaceship.width/3, spaceship.height/2 )
    }

    function addEvent(node, name, func) {
    if(node.addEventListener) {
    node.addEventListener(name, func, false);
    } else if(node.attachEvent) {
    node.attachEvent(name, func);
    }
    }

    function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2){
      // Verifie si les positions se superposent
      if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
          return false;
      }
      return true;
    }
    
    function addKeyboardEvents() {
    addEvent(document, "keydown", function(e) {
      if(e.keyCode == 32){ 
        keyboard[e.keyCode] = false;
      } else {keyboard[e.keyCode] = true;}
    });

    addEvent(document, "keyup", function(e) {
      if(e.keyCode == 32){ 
        keyboard[e.keyCode] = false;
        fireLaser();
      } else {keyboard[e.keyCode] = false;}
    });
    }

    function drawLasers(){
    context.fillStyle = "red";
    for(var iter in lasers){
    var laser = lasers[iter];
    context.fillRect(laser.x-6.5, laser.y-7, laser.width, laser.height);       
    }
    }

    function updateLasers() {
    // mouvement du laser
    for(var iter in lasers) {
    var laser = lasers[iter];
    laser.y -= 5;
    laser.counter++;
    }
    // determine la distance max que le laser peut parcourir
    lasers = lasers.filter(function(laser) {
    return laser.y >  spaceship.y - canvas.height/2 ;
    });
  }


    function fireLaser() {
    lasers.push ({
    x: spaceship.x + 20,
    y: spaceship.y - 30,
    width: 5,
    height: 30,
    collision: false,
    statut: true
    });
    }


    function updateSpaceship() {
    if(spaceship.statut == true){
    // Bouger a gauche
    if(keyboard[37]) {
    spaceship.x -= 2.5;
    if(spaceship.x < 0) { 
    spaceship.x = 0;
    }
    }

    // Bouger a droite 
    if(keyboard[39]) {
    spaceship.x += 2.5;
    var right = canvas.width - spaceship.width;
    if(spaceship.x > right) {
    spaceship.x = right;
    }
    }

    if(keyboard[32]) {
    // Tire un laser
    if(!keyboard.fired) {
    fireLaser();
    keyboard.fired = true;
    } else {
    keyboard.fired = false;
    }
    }
    // Bouge vers le haut
    if(keyboard[38]){
    spaceship.y -= 2.5;
    if(spaceship.y < 0){
    spaceship.y = 0;
    }
    }
    // Bouge vers le bas
    if(keyboard[40]){
    spaceship.y += 2.5 ;
    var bottom = canvas.height-spaceship.height;
    if(spaceship.y>bottom){
    spaceship.y = bottom
    }
    }
    }
    }


    // Technique vue sur le site suivant : https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
    function collDetection(){
      let obj1;
      let obj2;
      for(i = 0; i<aliens.length;i++){
        aliens[i].isColliding = false;
      
      for(j = 0; j < aliens.length; j++){
      obj1 = aliens[j];

      for(k = 0; k < lasers.length; k++){
      obj2 = lasers[k]

      if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
      obj1.isColliding = true;
      obj2.collision = true;
      }
      if ((obj1.isColliding == true) && (obj2.collision == true)){
      c += 1
      obj1.statut = false;
      obj2.statut = false;
      context.clearRect(obj2.x, obj2.y, obj2.width, obj2.height)
      aliens.splice(j,1);
      }
      }
      }
      }

      }

      function spaceshipColl(){
        let obj1;
        let obj2 = spaceship;
        for(i =0; i< aliens.length; i++){
        aliens[i].isColliding = false;
        for(j=0; j<aliens.length;j++){
        obj1 = aliens[j];
        if(rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
        obj1.isColliding = true;
        obj2.collision = true;
        }
        if ((obj1.isColliding == true)&&(obj2.collision == true)){
          obj2.statut = false;
          

      }
      }
      }
      }

      function laserColl(){
        let obj1;
        let obj2 = spaceship;
        for(i = 0; i < lasers.length; i++){
          lasers[i].collision = false;
        for(j = 0; j < lasers.length; j++){
          obj1 = lasers[j];
          if(rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
            obj1.collision = true;
            obj2.collision = true;
        }
        if ((obj1.collision == true) && (obj2.collision == true)){
          obj2.statut = false;
        }
      }
    }
  }