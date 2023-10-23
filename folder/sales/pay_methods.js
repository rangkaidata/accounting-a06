/*
 * name: budiono
 * edit: sep-04, 20:28, mon-2023; new;312;
 */ 

'use strict';

var PayMethods={
  url:'pay_methods',
  title:'Pay Methods'
};

PayMethods.show=(karcis)=>{
  karcis.modul=PayMethods.url;
  karcis.menu.name=PayMethods.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    const form=new BingkaiUtama(karcis);
    const indek=form.show();
    PayMethods.formPaging(indek);
  }else{
    show(baru);
  }
}

PayMethods.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>PayMethods.formCreate(indek));
  toolbar.search(indek,()=>PayMethods.formSearch(indek));
  toolbar.refresh(indek,()=>PayMethods.formPaging(indek));
  toolbar.download(indek,()=>PayMethods.formExport(indek));
  toolbar.upload(indek,()=>PayMethods.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    PayMethods.readShow(indek);
  });
}

PayMethods.readShow=(indek)=>{
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
        +' id="btn_first"'
        +' onclick="PayMethods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="PayMethods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>';  
        } else {
          html+= '<button type="button"'
          +' onclick="PayMethods.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="PayMethods.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
  +'<tr>'
  +'<th colspan="2">Pay Method</th>'
  +'<th>Description</th>'
  +'<th>Owner</th>'
  +'<th>Modified</th>'
  +'<th colspan=2>Action</th>'
  +'</tr>';

  if(paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
      +'<td align="center">'+paket.data[x].row_id+'</td>'
      +'<td>'+paket.data[x].pay_method_id+'</td>'
      +'<td>'+tHTML(paket.data[x].pay_method_name)+'</td>'

      +'<td align="center">'+paket.data[x].info.user_name+'</td>'
      +'<td align="center">'
        +tglInt(paket.data[x].info.date_modified)+'</td>'
      +'<td align="center">'
      
      +'<button type="button" id="btn_change" '
        +' onclick="PayMethods.formUpdate(\''+indek+'\''
        +',\''+paket.data[x].pay_method_id+'\');">'
        +'</button>'
        +'</td>'
        
      +'<td align="center">'
        +'<button type="button" id="btn_delete" '
        +' onclick="PayMethods.formDelete(\''+indek+'\''
        +',\''+paket.data[x].pay_method_id+'\');">'
        +'</button>'
        +'</td>'
      +'</tr>';
    }
  }
  
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

PayMethods.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  PayMethods.formPaging(indek);
}

PayMethods.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
      +'<li><label>Pay Method ID:</label>'
      +'<input type="text" id="pay_method_id_'+indek+'"></li>'
      
      +'<li><label>Description:</label>'
      +'<input type="text" id="pay_method_name_'+indek+'"></li>'
      
      +'<li><label>&nbsp;</label>'
      +'<label>'
        +'<input type="checkbox"'
        +' id="pay_method_inactive_'+indek+'">Inactive'
        +'</label>'
      +'</li>'
    +'</ul>'
    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode==MODE_CREATE){
    document.getElementById("pay_method_id_"+indek).focus();
  }else{  
    document.getElementById("pay_method_id_"+indek).disabled=true;
    document.getElementById("pay_method_name_"+indek).focus();
  }  
}

PayMethods.formCreate=(indek)=>{
  bingkai[indek].pay_id='';
  PayMethods.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>PayMethods.formPaging(indek));
  toolbar.save(indek,()=>PayMethods.createExecute(indek));
}

PayMethods.createExecute=(indek)=>{
  db3.createOne(indek,{
    "pay_method_id":getEV("pay_method_id_"+indek),
    "pay_method_name":getEV("pay_method_name_"+indek),
    "pay_method_inactive":getEC("pay_method_inactive_"+indek)
  });
}

PayMethods.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "pay_method_id":bingkai[indek].pay_method_id
  },(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data;
      setEV('pay_method_id_'+indek, d.pay_method_id);
      setEV('pay_method_name_'+indek, d.pay_method_name);
      setEC('pay_method_inactive_'+indek, d.pay_method_inactive);
      message.none(indek);
      return eop();
    }
  });
}

PayMethods.formUpdate=(indek,pay_method_id)=>{
  bingkai[indek].pay_method_id=pay_method_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  PayMethods.formEntry(indek,MODE_UPDATE);
  PayMethods.readOne(indek,()=>{
    toolbar.back(indek,()=>PayMethods.formLast(indek));
    toolbar.save(indek,()=>PayMethods.updateExecute(indek))
  });
}

PayMethods.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "pay_method_id":bingkai[indek].pay_method_id,
    "pay_method_name":getEV("pay_method_name_"+indek),
    "pay_method_inactive":getEC("pay_method_inactive_"+indek)
  });
}

PayMethods.formDelete=(indek,pay_method_id)=>{
  bingkai[indek].pay_method_id=pay_method_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  PayMethods.formEntry(indek,MODE_DELETE);
  PayMethods.readOne(indek,()=>{
    toolbar.back(indek,()=>PayMethods.formLast(indek));
    toolbar.delet(indek,()=>PayMethods.deleteExecute(indek));
  });
}

PayMethods.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "pay_method_id":bingkai[indek].pay_method_id
  });
}

PayMethods.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>PayMethods.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>PayMethods.formPaging(indek));
}

PayMethods.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  PayMethods.formResult(indek);
}

PayMethods.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>PayMethods.formSearch(indek));
  db3.search(indek,(paket)=>{
    PayMethods.readShow(indek);
  });
}

PayMethods.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  PayMethods.formPaging(indek):
  PayMethods.formResult(indek);
}

PayMethods.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new PayMethodLook(indek);
  objPop.show();
}

PayMethods.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>PayMethods.formPaging(indek));
  PayMethods.exportExecute(indek);
}

PayMethods.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'pay_methods.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

PayMethods.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{PayMethods.formPaging(indek);});
  iii.uploadJSON(indek);
}

PayMethods.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "pay_method_id":d[i][1],
      "pay_method_name":d[i][2],
      "pay_method_inactive":d[i][3]
    }
    db3.query(indek,PayMethods.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
// eof:312;
