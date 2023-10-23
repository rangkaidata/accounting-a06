/*
 * name: budiono
 * edit: sep-13, 15:22, wed-2023; new;
 * edit: oct-13, 09:24, fri-2023; xHTML;
 */ 
 
'use strict';

var Boms={
  url:'boms',
  title:'Bill of Materials'
};

Boms.show=(karcis)=>{
  karcis.modul=Boms.url;
  karcis.menu.name=Boms.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    Boms.formPaging(indek);
  }else{
    show(baru);
  }
}

Boms.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Boms.formCreate(indek);});
  toolbar.search(indek,()=>{Boms.formSearch(indek);});
  toolbar.refresh(indek,()=>{Boms.formPaging(indek);});
  toolbar.download(indek,()=>{Boms.formExport(indek);});
  toolbar.upload(indek,()=>{Boms.formImport(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});  
  db3.readPaging(indek,(paket)=>{
    Boms.readShow(indek);
  });
}

Boms.readShow=(indek)=>{
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
          +' onclick="Boms.gotoPage(\''+indek+'\',\''
          +paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Boms.gotoPage(\''+indek+'\',\''
          +paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page+'</button>';
        } else {
          html+= '<button type="button" '
          +'onclick="Boms.gotoPage(\''+indek+'\',\''
          +paket.paging.pages[x].page
          +'\')">'+paket.paging.pages[x].page+'</button>';
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last"'
        +' onclick="Boms.gotoPage(\''+indek+'\',\''
        +paket.paging.last+'\')"></button>';
      }
    }
  }  
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Item ID</th>'
    +'<th>Item Name</th>'
    +'<th>Part</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
      +'<td align="center">'+paket.data[x].row_id+'</td>'
      +'<td align="left">'+paket.data[x].item_id+'</td>'
      +'<td align="left">'+xHTML(paket.data[x].item_name)+'</td>'
      +'<td align="center">'+paket.data[x].item_count+' item</td>'
      +'<td align="center">'+paket.data[x].info.user_name+'</td>'
      +'<td align="center">'
        +tglInt(paket.data[x].info.date_modified)+'</td>'
      +'<td align="center"><button type="button" id="btn_change" '
        +' onclick="Boms.formUpdate(\''+indek+'\''
        +',\''+paket.data[x].item_id+'\');">'
        +'</button></td>'
        
      +'<td align="center"><button type="button" id="btn_delete" '
        +' onclick="Boms.formDelete(\''+indek+'\''
        +',\''+paket.data[x].item_id+'\');">'
        +'</button></td>'
      +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Boms.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Boms.formPaging(indek);
}

Boms.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;

  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" '
    +' style="margin-bottom:1rem;line-height:1.5rem;"></div>'
    +'<form autocomplete="off">'
    +'<fieldset id="bom_'+indek+'" style="border:0px;">'
    +'<ul>'
      +'<li><label>Item ID<i class="required">*</i>:</label>'
        +'<input type="text" id="item_id_'+indek+'" size="9" '
        +' onchange="Boms.getItem(\''+indek+'\''
        +',\'item_id_'+indek+'\',-1)">'
        
        +'<button type="button" class="btn_find" '
          +' id="btn_item_'+indek+'" '
          +' onclick="StockItems.lookUp(\''+indek+'\''
          +',\'item_id_'+indek+'\',-1)"></button>'
        
      +'</li>'
      
      +'<li><label>&nbsp;</label>'
        +'<input type="text" id="item_name_'+indek+'" disabled>'
      +'</li>'

    +'</ul>'
    +'</fieldset>'
    +'<details open>'
    +'<summary>Detail Components</summary>'
      +'<div id="bom_list_'+indek+'" '
      +' style="width:100%;overflow:auto;">bom list</div>'
    +'</details>'

    +'<ul>'
      +'<li><label>Note:</label>'
        +'<input type="text" id="bom_note_'+indek+'">'
        +'</li>'
    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode==MODE_CREATE){
    setEDisabled('bom_'+indek,false);
  }else{
    setEDisabled('bom_'+indek,true);
  }
}

function setEDisabled(id,bool){
  document.getElementById(id).disabled=bool;
}

Boms.formCreate=(indek)=>{  
  Boms.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Boms.formPaging(indek);});
  toolbar.save(indek,()=>{Boms.createExecute(indek);});
  bingkai[indek].isiTabel=[];
  Boms.setRows(indek,[]);
  document.getElementById('item_id_'+indek).focus();
}

Boms.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "bom_detail":bingkai[indek].isiTabel,
    "bom_note":getEV("bom_note_"+indek)
  });
}

Boms.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "item_id":bingkai[indek].item_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const d=paket.data;
      setEV('bom_note_'+indek, d.bom_note);
      setEV('item_id_'+indek, d.item_id);
      setEV('item_name_'+indek, d.item_name);
      Boms.setRows(indek,d.bom_detail);
    }
    message.none(indek);
    return callback();
  });
}

Boms.formUpdate=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Boms.formLast(indek);});
  Boms.formEntry(indek,MODE_UPDATE);
  Boms.readOne(indek,()=>{
    toolbar.save(indek,()=>{Boms.updateExecute(indek);});
  });
}

Boms.updateExecute=(indek)=>{
  db3.updateOne(indek,{ 
    "item_id":bingkai[indek].item_id,
    "bom_detail":bingkai[indek].isiTabel,
    "bom_note":getEV("bom_note_"+indek)
  });
}

Boms.formDelete=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Boms.formEntry(indek,MODE_DELETE);
  Boms.readOne(indek,()=>{
    toolbar.back(indek,()=>{Boms.formLast(indek);});
    toolbar.delet(indek,()=>{Boms.deleteExecute(indek);});
  });
}

Boms.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "item_id":bingkai[indek].item_id
  });
}

Boms.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Boms.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Boms.formPaging(indek);});
}

Boms.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek)
  Boms.formResult(indek);
}

Boms.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Boms.formSearch(indek);});
  db3.search(indek,()=>{
    Boms.readShow(indek);
  });
}

Boms.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Boms.formPaging(indek):
  Boms.formResult(indek);
}

Boms.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Boms.formPaging(indek));
  Boms.exportExecute(indek);
}

Boms.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'boms.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Boms.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Boms.formPaging(indek);});
  iii.uploadJSON(indek);
}

Boms.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "item_id":d[i][1],
      "bom_detail":d[i][2],
      "bom_note":d[i][3],
    }
    db3.query(indek,Boms.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Boms.getItem=(indek,id_kolom,baris)=>{
  Items.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(baris==-1) {
      setEV('item_name_'+indek, paket.data.item_name);
    }else{
      setEV('item_name_'+baris+'_'+indek, paket.data.item_name);
      Boms.setCell(indek,'item_name_'+baris+'_'+indek);
    }
  });
}

Boms.setStockItem=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  setEV(id_kolom, data.item_id);
  if(nama_kolom==-1){
    Boms.getItem(indek,id_kolom,nama_kolom); 
  }else{
    Boms.setCell(indek,id_kolom);
  }
}

Boms.setRows=function(indek,isi){
  if(isi===undefined) isi=[];
  var panjang=isi.length;
  var html=Boms.tableHead(indek);
  bingkai[indek].isiTabel=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'

      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="item_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_id+'" size="9"'
        +'onchange="Boms.setCell(\''+indek+'\''
        +',\'item_id_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"></td>'

      +'<td><button type="button" id="btn_find" '
      +' onclick="StockItems.lookUp(\''+indek+'\''
      +',\'item_id_'+i+'_'+indek+'\',\''+i+'\')"></button></td>'
      
      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="item_name_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_name+'" disabled></td>'
      
      +'<td  align="center" style="padding:0;margin:0;">'
        +'<input type="text" id="qty_needed_'+i+'_'+indek+'" '
        +' value="'+isi[i].qty_needed+'" size="3" '
        +' style="text-align:center"'
        +' onchange="Boms.setCell(\''+indek+'\''
        +',\'qty_needed_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" ></td>'
      
      +'<td align="center">'
        +'<button type="button" id="btn_add" '
        +' onclick="Boms.addRow(\''+indek+'\','+i+')" ></button>'
        +'<button type="button" id="btn_remove" '
        +' onclick="Boms.removeRow(\''+indek+'\','+i+')" ></button>'
      +'</td>'
      +'</tr>';
  }
  html+=Boms.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('bom_list_'+indek).innerHTML=html;
  if(panjang==0)Boms.addRow(indek,0);
}

Boms.tableHead=(indek)=>{
  return '<table>'
    +'<thead>'
    +'<tr>'
    +'<th colspan="3">Sub Item ID<i class="required">*</i></th>'
    +'<th>Description</th>'
    +'<th>Qty Needed</th>'
    +'<th>Add/Remove</th>'
    +'</tr>'
    +'</thead>';
}

Boms.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="6">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Boms.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].isiTabel;
  
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Boms.newRow(newBasket);
  }
  if(oldBasket.length==0)Boms.newRow(newBasket);
  Boms.setRows(indek,newBasket);
  
  // if(baris>0)document.getElementById('item_id'+i+'_'+indek).focus();
}

Boms.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.item_id="";
  myItem.item_name="";
  myItem.qty_needed=0;
  newBasket.push(myItem);
}

Boms.removeRow=(indek,number)=>{
  var arr=bingkai[indek].isiTabel;
  var newBasket=[];
  Boms.setRows(indek,arr);
  for(let i=0;i<arr.length;i++){
    if(i!==number)newBasket.push(arr[i]);
  }
  Boms.setRows(indek,newBasket);
}

Boms.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].isiTabel;
  var baru=[];
  var isiEdit={};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];

    if(id_kolom==('item_id_'+i+'_'+indek)){
      isiEdit.item_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      Boms.getItem(indek,'item_id_'+i+'_'+indek,i);
    }
    else if(id_kolom==('item_name_'+i+'_'+indek)){
      isiEdit.item_name=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('qty_needed_'+i+'_'+indek)){
      isiEdit.qty_needed=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
  }
  bingkai[indek].isiTabel=isi;
}

Boms.getOne=(indek,item_id,callBack)=>{
  db3.query(indek,Boms.url+'/read_one',{
    "item_id":item_id
  },(paket)=>{
    return callBack(paket);
  });
}

// eof:
