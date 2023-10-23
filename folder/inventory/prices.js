/*
 * name: budiono
 * date: sep-13, 16:16, wed-2023; new
 * edit: sep-20, 10:54, wed-2023; 
 */ 

'use strict';

var Prices={
  url:'prices',
  title:'Item Prices'
}

Prices.show=(tiket)=>{
  tiket.modul=Prices.url;
  tiket.menu.name=Prices.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    Prices.formPaging(indek);
  }else{
    show(baru);
  }
}

Prices.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Prices.formCreate(indek));
  toolbar.search(indek,()=>Prices.formSearch(indek));
  toolbar.refresh(indek,()=>Prices.formPaging(indek));
  toolbar.download(indek,()=>Prices.formExport(indek));
  toolbar.upload(indek,()=>Prices.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Prices.readShow(indek);
  });
}

Prices.readShow=(indek)=>{
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
        +' onclick="Prices.gotoPage(\''+indek+'\','
        +'\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Prices.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Prices.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" onclick="Prices.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Item ID</th>'
    +'<th>Item Name</th>'
    +'<th>Unit Price</th>'
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
        +'<td align="right">'+paket.data[x].unit_price+'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Prices.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Prices.formDelete(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Prices.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Prices.formPaging(indek);
}

Prices.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Item ID:</label>'
      +'<input type="text" id="item_id_'+indek+'"'
      +' onchange="Prices.getItem(\''+indek+'\''
      +',\'item_id_'+indek+'\')"'
      +' size="12">'
      
      +'<button type="button" id="btn_find" '
        +' onclick="Items.lookUp(\''+indek+'\''
        +',\'item_id_'+indek+'\',-1)"></button>'
      +'<input type="text" '
      +' id="item_name_'+indek+'"'
      +' disabled>'
      +'</li>'

    +'<li><label>Unit Price:</label>'
      +'<input type="text" id="unit_price_'+indek+'"'
      +' onfocus="this.select();"'
      +' style="text-align:center;"'
      +' size="6">'
      +'</li>'
    +'</ul>'

    +'<details open>'
      +'<summary>Price Details</summary>'
      +'<div id="price_detail_'+indek+'"></div>'
    +'</details>'
    
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);

  if(MODE_CREATE){
    document.getElementById('item_id_'+indek).focus();
  }else{
    document.getElementById('item_id_'+indek).disabled=true;
  }
}

Prices.formCreate=(indek)=>{
  bingkai[indek].price_id='';
  Prices.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Prices.formPaging(indek));
  toolbar.save(indek,()=>Prices.createExecute(indek));
  Prices.setRows(indek,[]);
}

Prices.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "unit_price":getEV("unit_price_"+indek),
    "price_detail":bingkai[indek].price_detail
  });
}

Prices.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "item_id":bingkai[indek].item_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      Prices.setValue(indek,paket.data);
    }
    message.none(indek);
    return callback();
  });
}

Prices.formUpdate=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Prices.formEntry(indek,MODE_UPDATE);
  Prices.readOne(indek,()=>{
    toolbar.back(indek,()=>Prices.formLast(indek));
    toolbar.save(indek,()=>Prices.updateExecute(indek));
  });
}

Prices.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "unit_price":getEV("unit_price_"+indek),
    "price_detail":bingkai[indek].price_detail
  });
}

Prices.formDelete=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Prices.formEntry(indek,MODE_DELETE);
  Prices.readOne(indek,()=>{
    toolbar.back(indek,()=>Prices.formLast(indek));
    toolbar.delet(indek,()=>Prices.deleteExecute(indek));
  });
}

Prices.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "item_id":bingkai[indek].item_id
  });
}

Prices.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Prices.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Prices.formPaging(indek));
}

Prices.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Prices.formResult(indek);
}

Prices.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Prices.formSearch(indek));
  db3.search(indek,()=>{
    Prices.readShow(indek);
  });
}

Prices.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Prices.formPaging(indek):
  Prices.formResult(indek);
}

Prices.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Prices.formPaging(indek));
  Prices.exportExecute(indek);
}

Prices.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'prices.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Prices.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Prices.formPaging(indek);});
  iii.uploadJSON(indek);
}

Prices.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "item_id":d[i][1],
      "unit_price":d[i][2],
      "price_detail":d[i][3]
    }
    db3.query(indek,Prices.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Prices.setRows=function(indek,isi){
  if(isi===undefined) isi=[];
  if(isi===null)isi=[];
  
  var panjang=isi.length;
  var html=Prices.tableHead(indek);
    
  bingkai[indek].price_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'     
        
      +'<td style="margin:0;padding:0" align="center">'
        +'<input type="text" id="level_'+i+'_'+indek+'" '
        +' value="'+isi[i].level+'" size="15" '
        +' onchange="Prices.setCell(\''+indek+'\''
        +',\'level_'+i+'_'+indek+'\')"'
        +' onfocus="this.select()"></td>'

      +'<td style="padding:0;margin:0;" align="center">'
        +'<input type="text" id="unit_price_'+i+'_'+indek+'"'
        +' value="'+isi[i].unit_price+'"'
        +' size="6" '
        +' style="text-align:right" '
        +' onchange="Prices.setCell(\''+indek+'\''
        +',\'unit_price_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" ></td>'
             
      +'<td align="center">'
        +'<button type="button" id="btn_add" '
        +' onclick="Prices.addRow(\''+indek+'\','+i+')" >'
        +'</button>'
        
      +'<button type="button" id="btn_remove"'
        +' onclick="Prices.removeRow(\''+indek+'\','+i+')" >'
        +'</button>'
        +'</td>'

      +'</tr>';
  }
  html+=Prices.tableFoot(indek);
  var budi=JSON.stringify(isi);
  document.getElementById('price_detail_'+indek).innerHTML=html;
  if(panjang==0) Prices.addRow(indek,[]);
}

Prices.tableHead=(indek)=>{
  return '<table id="myTable_'+indek+'" border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="2">Level</th>'
    +'<th>Price</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
    +'</thead>';
}

Prices.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="4">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Prices.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];

  oldBasket=bingkai[indek].price_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) Prices.newRow(newBasket);
  }
  if(oldBasket.length==0)Prices.newRow(newBasket);
  Prices.setRows(indek,newBasket);
}

Prices.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.level="";
  myItem.unit_price="";
  newBasket.push(myItem);
}

Prices.removeRow=(indek,number)=>{
  var isiTabel=bingkai[indek].price_detail;
  var newBasket=[];
  var amount=0;  
  Prices.setRows(indek,isiTabel);
  for(var i=0;i<isiTabel.length;i++){
    if (i!=(number))newBasket.push(isiTabel[i]);
  }
  Prices.setRows(indek,newBasket);
}

Prices.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].price_detail;
  var baru = [];
  var isiEdit = {};
  
  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('level_'+i+'_'+indek)){
      isiEdit.level=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('unit_price_'+i+'_'+indek)){
      isiEdit.unit_price=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
  }  
  bingkai[indek].price_detail=isi;
}

Prices.setItem=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  setEV(id_kolom, data.item_id);
  Prices.getItem(indek,id_kolom,nama_kolom); 
}

Prices.getItem=(indek,id_kolom,baris)=>{
  setEV('item_name_'+indek, '');
  Items.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    const d=paket.data;
    setEV('item_id_'+indek, d.item_id);
    setEV('item_name_'+indek, d.item_name);
    Prices.setOne(indek);
  });
}

Prices.getOne=(indek,item_id,callBack)=>{
  db3.query(indek,'prices/read_one',{
    "item_id":item_id
  },(paket)=>{
    return callBack(paket);
  });
}

Prices.setOne=(indek)=>{
  Prices.getOne(indek,getEV('item_id_'+indek),(paket)=>{
    if (paket.err.id==0){
      if(paket.count==0){
        Prices.formEntry(indek,MODE_CREATE);
        toolbar.save(indek,()=>Prices.createExecute(indek));
      }else{
        Prices.formEntry(indek,MODE_UPDATE);
        toolbar.save(indek,()=>Prices.updateExecute(indek));
      }
      Prices.setValue(indek,paket.data);
    }      
  });
}

Prices.setValue=(indek,d)=>{
  setEV('item_id_'+indek, d.item_id );
  setEV('item_name_'+indek, d.item_name);
  setEV('unit_price_'+indek, d.unit_price);
  Prices.setRows(indek,d.price_detail);
}

// eof: 
