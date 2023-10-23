/*
 * name: budiono
 * date: sep-04, 19:22, mon-2023; new;308;324;
 * edit: sep-19, 21:20, tue-2023; 
 */ 

'use strict';

var ItemTaxes={
  url:'item_taxes',
  title:'Item Taxes'
};

ItemTaxes.show=(tiket)=>{
  tiket.modul=ItemTaxes.url;
  tiket.menu.name=ItemTaxes.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newItm=new BingkaiUtama(tiket);
    const indek=newItm.show();
    ItemTaxes.formPaging(indek);
  }else{
    show(baru);
  }
}

ItemTaxes.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>ItemTaxes.formCreate(indek));
  toolbar.search(indek,()=>ItemTaxes.formSearch(indek));
  toolbar.refresh(indek,()=>ItemTaxes.formPaging(indek));
  toolbar.download(indek,()=>{ItemTaxes.formExport(indek);});
  toolbar.upload(indek,()=>{ItemTaxes.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    ItemTaxes.readShow(indek);
  });
}

ItemTaxes.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;

  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first"'
        +' onclick="ItemTaxes.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="ItemTaxes.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';
        } else {
          html+= '<button type="button"'
          +' onclick="ItemTaxes.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last"'
        +' onclick="ItemTaxes.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Tax ID</th>'
    +'<th>Description</th>'
    +'<th>Taxable</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan="2">Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].item_tax_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].item_tax_name)+'</td>'
        +'<td align="center">'+paket.data[x].item_tax_calculate+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="ItemTaxes.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].item_tax_id+'\');"></button>'
          +'</td>'
        +'<td class="rata-tengah">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="ItemTaxes.formDelete(\''+indek+'\''
          +',\''+paket.data[x].item_tax_id+'\');"></button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

ItemTaxes.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  ItemTaxes.formPaging(indek);
}

ItemTaxes.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Item Tax ID</label>'
      +'<input type="text" '
      +' id="item_tax_id_'+indek+'"></li>'
      
    +'<li><label>Description</label>'
      +'<input type="text" '
      +' id="item_tax_name_'+indek+'"></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" '
      +' id="item_tax_inactive_'+indek+'">Inactive</label></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" '
      +' id="item_tax_calculate_'+indek+'" checked>'
      +'With Tax</label></li>'
      
    +'</ul>'
    +'</form>'
    +'</div>';
    
  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode==MODE_CREATE){
    document.getElementById('item_tax_id_'+indek).focus();
  }else{
    document.getElementById('item_tax_id_'+indek).disabled=true;
    document.getElementById('item_tax_name_'+indek).focus();
    document.getElementById('item_tax_calculate_'+indek).disabled=true;
  }
}

ItemTaxes.formCreate=(indek)=>{
  ItemTaxes.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemTaxes.formPaging(indek));
  toolbar.save(indek,()=>ItemTaxes.createExecute(indek));
}

ItemTaxes.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_tax_id":getEV("item_tax_id_"+indek),
    "item_tax_name":getEV("item_tax_name_"+indek),
    "item_tax_inactive":getEC("item_tax_inactive_"+indek),
    "item_tax_calculate":getEC("item_tax_calculate_"+indek)
  });
}

ItemTaxes.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "item_tax_id":bingkai[indek].item_tax_id
  },(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data
      setEV('item_tax_id_'+indek, d.item_tax_id);
      setEV("item_tax_name_"+indek, d.item_tax_name);
      setEC('item_tax_inactive_'+indek, d.item_tax_inactive);
      setEC('item_tax_calculate_'+indek, d.item_tax_calculate);
      message.none(indek);
      return eop();
    }
  });
}

ItemTaxes.formUpdate=(indek,item_tax_id)=>{
  bingkai[indek].item_tax_id=item_tax_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ItemTaxes.formEntry(indek,MODE_UPDATE);
  ItemTaxes.readOne(indek,()=>{
    toolbar.back(indek,()=>ItemTaxes.formLast(indek));
    toolbar.save(indek,()=>ItemTaxes.updateExecute(indek));
  });
}

ItemTaxes.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "item_tax_id":bingkai[indek].item_tax_id,
    "item_tax_name":getEV("item_tax_name_"+indek),
    "item_tax_inactive":getEC("item_tax_inactive_"+indek)
  });
}

ItemTaxes.formDelete=(indek,item_tax_id)=>{
  bingkai[indek].item_tax_id=item_tax_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ItemTaxes.formEntry(indek,MODE_DELETE);
  ItemTaxes.readOne(indek,()=>{
    toolbar.back(indek,()=>ItemTaxes.formLast(indek));
    toolbar.delet(indek,()=>ItemTaxes.deleteExecute(indek));
  });
}

ItemTaxes.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "item_tax_id":bingkai[indek].item_tax_id
  });
}

ItemTaxes.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  ItemTaxes.formPaging(indek):
  ItemTaxes.formResult(indek);
}

ItemTaxes.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>ItemTaxes.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemTaxes.formPaging(indek));
}

ItemTaxes.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  ItemTaxes.formResult(indek);
}

ItemTaxes.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemTaxes.formSearch(indek));
  db3.search(indek,(paket)=>{
    ItemTaxes.readShow(indek);
  });
}

ItemTaxes.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemTaxes.formPaging(indek));
  ItemTaxes.exportExecute(indek);
}

ItemTaxes.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'item_taxes.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

ItemTaxes.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ItemTaxes.formPaging(indek);});
  iii.uploadJSON(indek);
}

ItemTaxes.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;  
  
  for (var i=0;i<j;i++){
    o={
      "item_tax_id":d[i][1],
      "item_tax_name":d[i][2],
      "item_tax_inactive":d[i][3],
      "item_tax_calculate":d[i][4],
    }
    db3.query(indek,ItemTaxes.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

ItemTaxes.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new ItemTaxesLook(indek);
  objPop.show();
}

ItemTaxes.getOne=(indek,item_tax_id,callBack)=>{
  db3.query(indek,'item_taxes/read_one',{
    "item_tax_id":item_tax_id
  },(paket)=>{
    return callBack(paket);
  });
}

//eof: 308;324;
