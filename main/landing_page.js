/*
 * name: budiono;
 * date: oct-21, 13:53, sun-2023; new;
 */

'use strict';
// #808080
//#fff
// with Huruf kecil;
function LandingPage(){
  const html=`
    <header style="background-color:#808080;
      color:#fff;
      padding: 20px;
      text-align:center;">
        <h1 style="word-spacing:30cm;">Rangkaidata.com</h1>
        <p>Accounting System with JavaScript</p>
    </header>
  
    <div style="max-width:800px;margin:0 auto;text-align:center;">
      <h2>
        <i>Sederhana &#x2219; Mudah &#x2219; Cepat</i>
      </h2>
      
      <p style="font-size:15px;line-height:1.5;">
      Selamat datang di rangkaidata.com, tempat terbaik untuk 
      mengelola dan mengatur data Anda dengan cara yang sederhana, 
      mudah, dan cepat. Kami menyediakan solusi yang memudahkan Anda 
      untuk mengatur data dengan efisien.
      </p>
      <br/>
      <p><strong><big>Ayo merangkai data, coba sekarang, GRATIS!</big></strong></p>
      <br/>
      <button 
        style="padding:10px 20px;
        display:inline-blok;
        background-color: #808080;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 20px;" onclick="MulaiLogin();">Masuk</button>
        
      <button 
        style="padding:10px 20px;
        display:inline-blok;
        background-color: #;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 20px;" onclick="MulaiRegister();">Buat Akun Baru</button>
      <br>
      <p><big>
        &#128997; General Ledger &nbsp;
        &#128998; Purchases &nbsp;
        &#128999; Sales &nbsp;
        &#129000; Inventory &nbsp;
        &#129001; Payroll &nbsp;
        &#129002; Job Costing &nbsp;
      </big></p>
        
    </div>
    
    
    <footer>
        <small>&copy; 2023 Rangkaidata.com &#x2219; Datablok.id </small>
        &nbsp; &#x2219; &nbsp;<a href="">GitHub.com</a>
    </footer>`;

  document.getElementById('landing_page').innerHTML=html;
};

function MulaiRegister(){
  var tiket=JSON.parse(JSON.stringify(bingkai[0]));
  tiket.parent=0;
  tiket.menu.id='register';
  tiket.folder=bingkai[0].folder;
  antrian.push(tiket);
  Menu.klik(antrian.length-1);
}

function MulaiLogin(){
  var tiket=JSON.parse(JSON.stringify(bingkai[0]));
  tiket.parent=0;
  tiket.menu.id='login';
  tiket.folder=bingkai[0].folder;
  antrian.push(tiket);
  Menu.klik(antrian.length-1);
}

//  &#x2219;
// &#10077; 
// &#10078;
// #808080
