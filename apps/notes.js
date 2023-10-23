/*
 * auth: budiono
 * date: sep-04, 20:15, mon-2023;new;44;
 * edit: oct-02, 20:45, mon-2023;with crudse;
 * edit: oct-12, 15:06, thu-2023;str10;
 */ 
 
'use strict';

var Notes={
  title:'Notes',
  url:'notes'
}

Notes.show=(tiket)=>{
  tiket.modul=Notes.url;
  tiket.menu.name=Notes.title;
  tiket.bisa.tambah=1;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    //Notes.formCreate(indek);
    Notes.formPaging(indek);
  }else{
    show(baru);
  }
}

Notes.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Notes.formCreate(indek));
  toolbar.search(indek,()=>Notes.formSearch(indek));
  toolbar.refresh(indek,()=>Notes.formPaging(indek));
  toolbar.download(indek,()=>Notes.formExport(indek));
  toolbar.upload(indek,()=>Notes.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Notes.readShow(indek);
  });
}

Notes.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button"'
        +' id="btn_first" '
        +' onclick="Notes.gotoPage(\''+indek+'\','
        +'\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Notes.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Notes.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" onclick="Notes.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Title</th>'
    +'<th>Content</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].note_title)+'</td>'
        +'<td align="left">'+str10(xHTML(paket.data[x].note_content))+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Notes.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].note_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Notes.formDelete(\''+indek+'\''
          +',\''+paket.data[x].note_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Notes.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  const tinggi=(parseInt(
    document.getElementById('frm_konten_'+indek).offsetHeight
  )-100)+'px';
  
  const html ='<div style="padding:0.5rem">'
  +content.title(indek)
  +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
  //+'<form autocomplete="off">'
  
  
    +'<form autocomplete="off">'
      +'<input type="text" '
      +' id="note_title_'+indek+'"'
      +' placeholder="title"'
      +' style="width:99%;">'

      +'<div align="center">'    
        +'<textarea '
        +' id="note_content_'+indek+'"'
        +' spellcheck="false"'
        +' style="width:99%;'
          +' height:'+tinggi+';'
          +' top:0;border:1px solid lightgrey;'
          +' border-radius:20px;'
          +' font-size:14px;">'
        +'</textarea>'
      +'</div>'
    +'</form>'
  
  +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  document.getElementById('note_title_'+indek).focus();
}

Notes.formCreate=(indek)=>{
  Notes.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Notes.formPaging(indek));
  toolbar.save(indek,()=>Notes.createExecute(indek));
}

Notes.createExecute=(indek)=>{
  const note_id=new Date().getTime();
  db1.createOne(indek,{
    "note_id":note_id,
    "note_title":getEV("note_title_"+indek),
    "note_content":getEV("note_content_"+indek)
  });
}

Notes.readOne=(indek,eop)=>{
  db1.readOne(indek,{
    "note_id":bingkai[indek].note_id
  },(paket)=>{
    if (paket.err.id==0){
      const d=paket.data;
      setEV('note_title_'+indek, d.note_title);
      setEV('note_content_'+indek, d.note_content);
      message.none(indek);
      return eop();
    }
  });
}

Notes.formUpdate=(indek,note_id)=>{
  bingkai[indek].note_id=note_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Notes.form(indek,MODE_UPDATE);
  Notes.readOne(indek,()=>{
    toolbar.back(indek,()=>Notes.formLast(indek));
    toolbar.save(indek,()=>Notes.updateExecute(indek));
  });
}

Notes.updateExecute=(indek)=>{
  db1.updateOne(indek,{
    "note_id":bingkai[indek].note_id,
    "note_title":getEV("note_title_"+indek),
    "note_content":getEV("note_content_"+indek),
  });
}

Notes.formDelete=(indek,note_id)=>{
  bingkai[indek].note_id=note_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Notes.form(indek,MODE_DELETE);
  Notes.readOne(indek,()=>{
    toolbar.back(indek,()=>Notes.formLast(indek));
    toolbar.delet(indek,()=>Notes.deleteExecute(indek));
  });
}

Notes.deleteExecute=(indek)=>{
  db1.deleteOne(indek,{
    "note_id":bingkai[indek].note_id
  });
}

Notes.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Notes.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Notes.formPaging(indek));
}

Notes.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Notes.formResult(indek);
}

Notes.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Notes.formSearch(indek));
  db3.search(indek,()=>{
    Notes.readShow(indek);
  });
}

Notes.formLast=function(indek){
  bingkai[indek].text_search==''?
  Notes.formPaging(indek):
  Notes.formResult(indek);
}

Notes.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Notes.formPaging(indek));
  Notes.exportExecute(indek);
}

Notes.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'notes.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Notes.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Notes.formPaging(indek);});
  iii.uploadJSON(indek);
}

Notes.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "note_id":d[i][0],
      "note_title":d[i][1],
      "note_content":d[i][2],
    }
    db1.query(indek,'notes/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
// eof:44;303;
