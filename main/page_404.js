/*
 * auth: budiono
 * date: sep-04, 21:41, mon-2023; new;30;
 */ 
 
'use strict';

var Page404={}

Page404.show=(tiket)=>{
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Page404.formPaging(indek);
  }else{
    show(baru);
  }  
}

Page404.formPaging=(indek)=>{
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  Page404.form(indek);
}

Page404.form=(indek)=>{
  var html='<h1>Page Not Found</h1>'
  content.html(indek,html);
}
// eof:30;
