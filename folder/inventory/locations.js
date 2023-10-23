/*
 * name: budiono
 * date: sep-04, 18:03, mon-2023; new;313;
 * edit: sep-19, 21:06, tue-2023; 
 */ 

'use strict';

var Locations={
  url:'locations',
  title:'Item Locations'
}

Locations.show=(tiket)=>{
  tiket.modul=Locations.url;
  tiket.menu.name=Locations.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    Locations.formPaging(indek);
  }else{
    show(baru);
  }
}

Locations.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Locations.formCreate(indek));
  toolbar.search(indek,()=>Locations.formSearch(indek));
  toolbar.refresh(indek,()=>Locations.formPaging(indek));
  toolbar.download(indek,()=>Locations.formExport(indek));
  toolbar.upload(indek,()=>Locations.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Locations.readShow(indek);
  });
}

Locations.readShow=(indek)=>{
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
        +' onclick="Locations.gotoPage(\''+indek+'\','
        +'\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Locations.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Locations.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" onclick="Locations.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Location ID</th>'
    +'<th>Description</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].location_name)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Locations.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].location_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Locations.formDelete(\''+indek+'\''
          +',\''+paket.data[x].location_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Locations.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Locations.formPaging(indek);
}

Locations.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Location ID:</label>'
      +'<input type="text" id="location_id_'+indek+'" size="9"></li>'
      
    +'<li><label>Description:</label>'
      +'<input type="text" id="location_name_'+indek+'" size="30"></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" id="location_inactive_'+indek+'">'
      +'Inactive</label>'
      +'</li>'
      
    +'<li><label>Type:</label>'
      +'<select id="location_type_'+indek+'">'
      +getDataLocationType(indek)
      +'</select>'
      +'</li>'

    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if (metode===MODE_CREATE){
    document.getElementById('location_id_'+indek).focus();
  }else{
    document.getElementById('location_id_'+indek).disabled=true;
    document.getElementById('location_name_'+indek).focus();
  }
}

Locations.formCreate=(indek)=>{
  bingkai[indek].location_id='';
  Locations.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Locations.formPaging(indek));
  toolbar.save(indek,()=>Locations.createExecute(indek));
}

Locations.createExecute=(indek)=>{
  db3.createOne(indek,{
    "location_id":getEV("location_id_"+indek),
    "location_name":getEV("location_name_"+indek),
    "location_inactive":getEC("location_inactive_"+indek),
    "location_type":getEI("location_type_"+indek)
  });
}

Locations.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "location_id":bingkai[indek].location_id
  },(paket)=>{
    if (paket.err.id==0){
      const d=paket.data;
      setEV('location_id_'+indek, d.location_id );
      setEV('location_name_'+indek, d.location_name);
      setEC('location_inactive_'+indek, d.location_inactive);
      setEI('location_type_'+indek, d.location_type);
      message.none(indek);
      return eop();
    }
  });
}

Locations.formUpdate=(indek,location_id)=>{
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Locations.form(indek,MODE_UPDATE);
  Locations.readOne(indek,()=>{
    toolbar.back(indek,()=>Locations.formLast(indek));
    toolbar.save(indek,()=>Locations.updateExecute(indek));
  });
}

Locations.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "location_id":bingkai[indek].location_id,
    "location_name":getEV("location_name_"+indek),
    "location_inactive":getEC("location_inactive_"+indek),
    "location_type":getEI("location_type_"+indek),
  });
}

Locations.formDelete=(indek,location_id)=>{
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Locations.form(indek,MODE_DELETE);
  Locations.readOne(indek,()=>{
    toolbar.back(indek,()=>Locations.formLast(indek));
    toolbar.delet(indek,()=>Locations.deleteExecute(indek));
  });
}

Locations.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "location_id":bingkai[indek].location_id
  });
}

Locations.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Locations.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Locations.formPaging(indek));
}

Locations.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Locations.formResult(indek);
}

Locations.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Locations.formSearch(indek));
  db3.search(indek,()=>{
    Locations.readShow(indek);
  });
}

Locations.formLast=function(indek){
  bingkai[indek].text_search==''?
  Locations.formPaging(indek):
  Locations.formResult(indek);
}

Locations.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Locations.formPaging(indek));
  Locations.exportExecute(indek);
}

Locations.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'locations.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Locations.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Locations.formPaging(indek);});
  iii.uploadJSON(indek);
}

Locations.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "location_id":d[i][1],
      "location_name":d[i][2],
      "location_inactive":d[i][3],
      "location_type":d[i][4]
    }
    db3.query(indek,'locations/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Locations.lookUp=(indek,id_kolom,id_baris)=>{
  bingkai[indek].id_kolom=id_kolom;
  bingkai[indek].id_baris=id_baris;

  objPop=new LocationLook(indek);
  objPop.show();
}

Locations.getOne=(indek,location_id,callBack)=>{
  db3.query(indek,'locations/read_one',{
    "location_id":location_id
  },(paket)=>{
    return callBack(paket);
  });
}
//eof: 313;
