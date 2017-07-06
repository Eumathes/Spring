// Spring drawing constants for top bar
var springHeight = 32,  // Deklaracija i inicijalizacija varijable springHeight
    left,               // Deklaracija varijable left
    right,              // Deklaracija varijable right
    maxHeight = 200,    // Deklaracija i inicijalizacija varijable maxHeight
    minHeight = 100,    // Deklaracija i inicijalizacija varijable minHeight
    over = false,       // Deklaracija i inicijalizacija varijable over
    move = false;       // Deklaracija i inicijalizacija varijable move

// Spring simulation constants
var M = 0.8,  // Mass
    K = 0.2,  // Spring constant
    D = 0.92, // Damping
    R = 150;  // Rest position

// Spring simulation variables
var ps = R,   // Position
    vs = 0.0, // Velocity
    as = 0,   // Acceleration
    f = 0;    // Force

var mSlider, kSlider, dSlider, rSlider; // Deklaracija varijabli za klizače

function setup() {          // Poziv funkcije setup() pomocu koje definiramo pocetna svojstva okruzenja kao sto su velicina zaslona i boja pozadine te ucitavanje medija kao sto su slike i fontovi dok se program pokrece. NAPOMENA: Varijable deklarirane unutar setup() nisu dostupne unutar drugih funkcija, ukljucujuci draw()
  createCanvas(710, 400);   // Stvori platno 710 pixela sirine i 400 pixela visine
  
  textSize(15);             // Postavi veličinu fonta na 15 pixela
  
  rectMode(CORNERS);        // Način rada koji prva dva parametra rect() tumači kao gornji lijevi kut oblika, a treći i četvrti parametri su njegova širina i visina 
  noStroke();               // Onemoguci crtanje obrisa
  left = width/2 - 100;     // Definicija i inicijalizacija varijable left
  right = width/2 + 100;    // Definicija i inicijalizacija varijable right
  
  // Stvori klizače
  mSlider = createSlider(0, 5, 0.8, 0.1);   // Klizač ima raspon između 0 i 5 sa trenutnom vrijednoscu 0.8 te korakom 0.1
  mSlider.position(20, 20);                 // Stvori klizač na zaslonu na položaju 20 pixela po horizontali i 20 pixela po vertikali
  kSlider = createSlider(0, 1, 0.2, 0.1);   // Klizač ima raspon između 0 i 1 sa trenutnom vrijednoscu 0.2 te korakom 0.1
  kSlider.position(20, 50);                 // Stvori klizač na zaslonu na položaju 20 pixela po horizontali i 50 pixela po vertikali
  dSlider = createSlider(0, 1, 0.05, 0.01); // Klizač ima raspon između 0 i 1 sa trenutnom vrijednoscu 0.05 te korakom 0.01
  dSlider.position(20, 80);                 // Stvori klizač na zaslonu na položaju 20 pixela po horizontali i 80 pixela po vertikali
  rSlider = createSlider(90, 180, 150);     // Klizač ima raspon između 90 i 180 sa trenutnom vrijednoscu 150
  rSlider.position(20, 110);                // Stvori klizač na zaslonu na položaju 20 pixela po horizontali i 110 pixela po vertikali
  
}

function draw() {   // Poziv funkcije draw() koja kontinuirano izvršava linije koda koje se nalaze unutar njezinog bloka dok se program ne zaustavi ili se pozove noLoop()
  background(51);   // Poziv funckije background() koja definira boju koja se koristi za pozadinu platna. Default pozadina je svijetlosiva.
  updateSpring();   // Poziv updateSpring()
  drawSpring();     // Poziv funkcije drawSpring()
  
  text("Masa (" + M + " kg)", mSlider.x * 2 + mSlider.width, 35);                      // Nacrtaj tekst na zaslon gdje prvi parametar predstavlja string koji će biti prikazan, drugi parametar predstavlja x-koordinatu teksta, a treći parametar predstavlja y-koordinatu teksta                  
  text("Konstanta opruge (" + K + " N/m)", kSlider.x * 2 + kSlider.width, 65);         // Nacrtaj tekst na zaslon gdje prvi parametar predstavlja string koji će biti prikazan, drugi parametar predstavlja x-koordinatu teksta, a treći parametar predstavlja y-koordinatu teksta 
  text("Prigušenje (" + D + " kg/s)", dSlider.x * 2 + dSlider.width, 95);              // Nacrtaj tekst na zaslon gdje prvi parametar predstavlja string koji će biti prikazan, drugi parametar predstavlja x-koordinatu teksta, a treći parametar predstavlja y-koordinatu teksta 
  text("Položaj mirovanja (" + R + " px visine)", rSlider.x * 2 + rSlider.width, 125); // Nacrtaj tekst na zaslon gdje prvi parametar predstavlja string koji će biti prikazan, drugi parametar predstavlja x-koordinatu teksta, a treći parametar predstavlja y-koordinatu teksta 
  
  M = mSlider.value(); // Varijabli M pridijeli vrijednost varijable mSlider
  K = kSlider.value(); // Varijabli K pridijeli vrijednost varijable kSlider
  D = dSlider.value(); // Varijabli D pridijeli vrijednost varijable dSlider
  R = rSlider.value(); // Varijabli R pridijeli vrijednost varijable rSlider
}

function drawSpring() {                                                         // Deklaracija funkcije drawSpring()
  // Draw base
  fill(0.2);                                                                    // Postavi boju za popunjavanje oblika
  var baseWidth = 0.5 * ps + -8;                                                // Deklaracija i inicijalizacija varijable baseWidth
  rect(width/2 - baseWidth, ps + springHeight, width/2 + baseWidth, height);    // Nacrtaj pravokutnik na zaslonu gdje varijable width/2-baseWidth prestavljaja x-koordinatu, varijable ps+springHeight predstavlja y-koordinatu, varijable width/2+baseWidth predstavljaja sirinu, a varijabla height predstavlja visinu pravokutnika

  // Set color and draw top bar
  if (over || move) {   // Ako je varijabla over ili move istina, izvrši sljedeći blok koda 
    fill(255);          // Postavi boju za popunjavanje oblika
  } else {              // Ako je uvjet neistinit, izvrši sljedeći blok koda
    fill(204);          // Postavi boju za popunjavanje oblika
  }

  rect(left, ps, right, ps + springHeight); // Nacrtaj pravokutnik na zaslon gdje varijabla left predstavlja x-koordinatu, varijabla ps predstavlja y-koordinatu, varijabla right predstavlja sirinu, a varijable ps+springHeight predstavljaja visinu pravokutnika
}

function updateSpring() { // Deklaracija funkcije updateSpring()
  // Update the spring position
  if ( !move ) {         // Ako je uvjet unutar zagrada istinit, izvrši sljedeći blok koda
    f = -K * ( ps - R ); // f=-ky
    as = f / M;          // Set the acceleration, f=ma == a=f/m
    if (M == 0) {        // Dodano kako bi se izbjegao prekid i urušavanje crteža 
     M = 0.8;            // Vrati varijablu M na početnu zadanu vrijednost
     as = f / M;         // Set the acceleration, f=ma == a=f/m
    }
    vs = abs(D-1) * (vs + as);  // Set the velocity
    ps = ps + vs;        // Updated position
  }

  if (abs(vs) < 0.1) {  // Ako je uvjet unutar zagrada istinit, izvrši sljedeći blok koda. Funkcija abs() izračunava apsolutnu vrijednost broja i apsolutna vrijednost broja je uvijek pozitivna.
    vs = 0.0;
  }

  // Test if mouse if over the top bar
  if (mouseX > left && mouseX < right && mouseY > ps && mouseY < ps + springHeight) { // Ako je uvjet unutar zagrada istinit, izvrši sljedeći blok koda. Varijabla sustava mouseX uvijek sadrži trenutnu horizontalnu koordinatu miša, varijabla sustava mouseY uvijek sadrži trenutnu vertikalnu koordinatu miša.
    over = true;
  } else {  // Ako je uvjet neistinit, izvrši sljedeći blok koda.
    over = false;
  }

  // Set and constrain the position of top bar
  if (move) {   // Ako je varijabla move istina, izvrši sljedeći blok koda
    ps = mouseY - springHeight/2;
    ps = constrain(ps, minHeight, maxHeight); // Ograniči vrijednost kako ne bi prelazila maksimalnu i minimalnu vrijednost, gdje prvi parametar predstavlja vrijednost koju ograničavamo, a drugi i treći parametar predstavljaju minimalnu te maksimalnu granicu
  }
}

function mousePressed() {   // Funkcija mousePressed() se zove jednom nakon svakog pritiska tipke miša 
  if (over) {               // Ako je varijabla over istina, izvrši sljedeći blok koda
    move = true;
  }
}

function mouseReleased() {  // Funkcija mouseReleased() se zove svaki put kad se otpusti tipka miša
  move = false; 
}