/*
 * auth: budiono
 * date: aug-31, 08:29, thu-2023; new;10;
 * edit: sep-04, 21:49, mon-2023; add;59;
 * edit: sep-05, 11:10, tue-2023; add;64;
 */

'use strict';

content.html=function(indek,isi){
  document.getElementById("frm_konten_"+indek).innerHTML=isi;
}

content.wait=function(indek){
  document.getElementById("frm_konten_"+indek).innerHTML=
    '<span style="background-color:gold;'
    +'padding:0.5rem;margin:0.1rem;border-radius:0rem 1rem 1rem;">'
    +'Sending, please wait ...</span>';
};

content.title=function(indek){
  const html='<div style="display:flex;flex-direction:row;'
    +'margin-bottom:0.1rem;border:0px solid blue;">'
      +'<div style="flex-grow:1;align-self:center;'
      +'border:0px solid blue;">'
        +'<h1 style="margin:0rem 0 1rem 0;'
          +'border-radius:0px 30px 30px 0px;'
          +'">'+bingkai[indek].metode+'</h1>'
      +'</div>'
      +'<div style="flex-grow:1;text-align:right;'
      +'align-self:center;border:0px solid blue;">'
        +'<h1 style="margin:0rem 0 1rem 0;'
          +'border-radius:0px 30px 30px 0px;'
          +'">'+bingkai[indek].menu.name+'</h1>'
      +'</div>'
    +'</div>';
  return (html);
}

content.infoPaket=function(indek,paket){
  message.paket(indek,paket);
  statusbar.message(indek,paket);
  document.getElementById('frm_konten_'+indek).scrollTop = 0;
}

content.search=function(indek,func){
  this.html(indek,'<div style="padding:0.5rem;">'
    +this.title(indek)
    +'<input type="text" id="text_search_'+indek+'"'
    +' placeholder="Type text to search ..."'
    +' value="'+bingkai[indek].text_search+'"'
    +' onfocus="this.select()">'
    +'<button type="button"'
    +' id="btn_search_'+indek+'"'
    +' class="btn_search"></button></div>');

  document.getElementById('text_search_'+indek).focus();
  document.getElementById('btn_search_'+indek).onclick=func;
  statusbar.ready(indek);
}

content.infoError=function(indek,paket){
  this.html(indek,db.info(paket));  
}
// eof: 10;59;64;
