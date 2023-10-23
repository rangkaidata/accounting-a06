/*
 * name: budiono
 * date: sep-04, 20:26, mon-2023; new;296;
 */ 

'use strict';

var ShipVia={
  url:'ships',
  title:'Ship Methods'
};

ShipVia.show=(karcis)=>{
  karcis.modul=ShipVia.url;
  karcis.menu.name=ShipVia.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const form=new BingkaiUtama(karcis);
    const indek=form.show();
    ShipVia.formPaging(indek);
  }else{
    show(baru);
  }
}

ShipVia.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{ShipVia.formCreate(indek);});
  toolbar.search(indek,()=>{ShipVia.formSearch(indek);});
  toolbar.refresh(indek,()=>{ShipVia.formPaging(indek);});
  toolbar.download(indek,()=>{ShipVia.formExport(indek);});
  toolbar.upload(indek,()=>{ShipVia.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    ShipVia.readShow(indek);
  });
}

ShipVia.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;

  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" '
        +' id="btn_first" '
        +' onclick="ShipVia.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="ShipVia.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="ShipVia.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" onclick="ShipVia.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Ship Method</th>'
    +'<th>Name</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan="2">Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].ship_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].ship_name)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_change" '
          +' onclick="ShipVia.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].ship_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" id="btn_delete" '
          +' onclick="ShipVia.formDelete(\''+indek+'\''
          +',\''+paket.data[x].ship_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

ShipVia.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  ShipVia.formPaging(indek);
}

ShipVia.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    +'<li><label>Ship Via:</label>'
      +'<input type="text" id="ship_id_'+indek+'"></li>'
    +'<li><label>Name:</label>'
      +'<input type="text" id="ship_name_'+indek+'"></li>'
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" '
      +' id="ship_inactive_'+indek+'">Inactive</label>'
      +'</li>'
    +'</ul>'
    +'</form>'
    +'</div>';
    
  content.html(indek,html);  
  statusbar.ready(indek);

  if(metode==MODE_CREATE){
    document.getElementById('ship_id_'+indek).focus();
  }else{
    document.getElementById('ship_id_'+indek).disabled=true;
  }
}

ShipVia.formCreate=(indek)=>{
  ShipVia.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ShipVia.formPaging(indek);});
  toolbar.save(indek,()=>{ShipVia.createExecute(indek);});
}

ShipVia.createExecute=(indek)=>{
  db3.createOne(indek,{
    "ship_id":getEV("ship_id_"+indek),
    "ship_name":getEV("ship_name_"+indek),
    "ship_inactive":getEC("ship_inactive_"+indek)
  });
}

ShipVia.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "ship_id":bingkai[indek].ship_id
  },(paket)=>{
    if (paket.err.id==0){
      const d=paket.data;
      setEV('ship_id_'+indek, d.ship_id);
      setEV('ship_name_'+indek, d.ship_name);
      setEC('ship_inactive_'+indek, d.ship_inactive);
      message.none(indek);
      return eop();
    }
  });
}

ShipVia.formUpdate=(indek,ship_id)=>{
  bingkai[indek].ship_id=ship_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ShipVia.formEntry(indek,MODE_UPDATE);
  ShipVia.readOne(indek,()=>{
    toolbar.back(indek,()=>{ShipVia.formLast(indek);});
    toolbar.save(indek,()=>{ShipVia.updateExecute(indek);});
  });
}

ShipVia.updateExecute=function(indek){
  db3.updateOne(indek,{
    "ship_id":bingkai[indek].ship_id,
    "ship_name":getEV('ship_name_'+indek),
    "ship_inactive":getEC("ship_inactive_"+indek)
  });
}

ShipVia.formDelete=(indek,ship_id)=>{
  bingkai[indek].ship_id=ship_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ShipVia.formEntry(indek,MODE_DELETE);
  ShipVia.readOne(indek,()=>{
    toolbar.back(indek,()=>{ShipVia.formLast(indek);});
    toolbar.delet(indek,()=>{ShipVia.deleteExecute(indek);});
  });
}

ShipVia.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "ship_id":bingkai[indek].ship_id
  });
}

ShipVia.formLast=function(indek){
  bingkai[indek].text_search==''?
  ShipVia.formPaging(indek):
  ShipVia.formResult(indek);
}

ShipVia.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>ShipVia.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ShipVia.formPaging(indek);});
}

ShipVia.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  ShipVia.formResult(indek);
}

ShipVia.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ShipVia.formSearch(indek);});
  db3.search(indek,()=>{
    ShipVia.readShow(indek);
  });
}

ShipVia.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ShipVia.formPaging(indek));
  ShipVia.exportExecute(indek);
}

ShipVia.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'ship_methods.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

ShipVia.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ShipVia.formPaging(indek);});
  iii.uploadJSON(indek);
}

ShipVia.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "ship_id":d[i][1],
      "ship_name":d[i][2],
      "ship_inactive":d[i][3]
    }
    db3.query(indek,ShipVia.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

ShipVia.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new ShipMethodLook(indek);
  objPop.show();
}
// eof: 296;
