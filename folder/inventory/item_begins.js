/*
 * name: budiono
 * date: sep-29, 11:10, fri-2023; new; 
 * edit: oct-01, 09:34, sun-2023; 
 */ 

'use strict';

var ItemBegins={
  title:'Inventory Beginning Balances',
  url:'item_begins'
}

ItemBegins.show=(karcis)=>{
  karcis.modul=ItemBegins.url;
  karcis.menu.name=ItemBegins.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    ItemBegins.formPaging(indek);
  }else{
    show(baru);
  }
}

ItemBegins.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>{ItemBegins.formSearch(indek);});
  toolbar.neuu(indek,()=>{ItemBegins.formCreate(indek);});
  toolbar.refresh(indek,()=>{ItemBegins.formPaging(indek)});
  toolbar.download(indek,()=>{ItemBegins.formExport(indek);});
  toolbar.upload(indek,()=>{ItemBegins.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    ItemBegins.readShow(indek);
  });
  ItemBegins.getDefault(indek);
}

ItemBegins.getDefault=(indek)=>{
  ItemDefaults.getDefault(indek);
}

ItemBegins.readShow=function(indek){
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="ItemBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="ItemBegins.gotoPage(\''+indek+'\''
          +' ,\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="ItemBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="ItemBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Item ID</th>'
    +'<th>Item Name</th>'    
    +'<th>Quantity</th>'
    +'<th>Unit Cost</th>'
    +'<th>Total Cost</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].item_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].item_name)+'</td>'
        
        +'<td align="right">'+(paket.data[x].quantity)+'</td>'
        +'<td align="right">'
          +formatSerebuan(paket.data[x].unit_cost)+'</td>'
        +'<td align="right">'
          +formatSerebuan(paket.data[x].total_cost)+'</td>'
          
        +'<td align="center"><button type="button" '
          +' id="btn_change" '
          +' onclick="ItemBegins.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');"></button></td>'
          
        +'<td align="center"><button type="button" '
          +' id="btn_delete" '
          +'onclick="ItemBegins.formDelete(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');"></button></td>'

        +'</tr>';
    }
  }
  
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

ItemBegins.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  ItemBegins.formPaging(indek);
}

ItemBegins.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    +'<li><label>Item ID</label>: '
      +'<input type="text" '
      +' id="item_id_'+indek+'"'
      +' onchange="ItemBegins.getItem(\''+indek+'\''
      +',\'item_id_'+indek+'\')"'
      +' size="10">'
      
      +'<button type="button" id="btn_find" '
        +' onclick="Items.lookUp(\''+indek+'\''
        +',\'item_id_'+indek+'\',-1)"></button>'
      +'</li>'
      
    +'<li><label>Description</label>: '
      +'<input type="text"'
      +' id="item_name_'+indek+'"'
      +' size="25"'
      +' disabled></li>'
        
    +'</ul>'
    
    +'<details open>'
      +'<summary>Item Begin Details</summary>'
      +'<div id="begin_detail_'+indek+'"></div>'
    +'</details>'

    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  document.getElementById('item_id_'+indek).focus();
}

ItemBegins.calculator=function(kolom,indek){
  if(kolom=='qty' || kolom=='cost'){
    document.getElementById('total_cost_'+indek).value=
    Number(document.getElementById('quantity_'+indek).value)*
    Number(document.getElementById('unit_cost_'+indek).value);
  }
  else if(kolom=='total'){
    document.getElementById('unit_cost_'+indek).value=
    Number(document.getElementById('total_cost_'+indek).value)/
    Number(document.getElementById('quantity_'+indek).value);
  }
}

ItemBegins.formCreate=(indek)=>{
  ItemBegins.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemBegins.formPaging(indek));
  toolbar.save(indek,()=>ItemBegins.createExecute(indek));
  ItemBegins.setDefault(indek);
}

ItemBegins.setDefault=(indek)=>{
  bingkai[indek].item_id='';
  ItemBegins.setRows(indek,[] );
}

ItemBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV('item_id_'+indek),
    "begin_detail":bingkai[indek].begin_detail
  });
}

ItemBegins.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "item_id":bingkai[indek].item_id
  },(paket)=>{
    if(paket.err.id==0 || paket.count>0){
      const d=paket.data;
      setEV('item_id_'+indek, d.item_id);
      setEV('item_name_'+indek, d.item_name);
      ItemBegins.setRows(indek, d.begin_detail);    
    }
    message.none(indek);
    return callback();
  });
}

ItemBegins.formUpdate=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ItemBegins.formEntry(indek,MODE_UPDATE);
  ItemBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{ItemBegins.formLast(indek);});
    toolbar.save(indek,()=>{ItemBegins.updateExecute(indek);});
  });
}

ItemBegins.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "item_id":bingkai[indek].item_id,
    "begin_detail":bingkai[indek].begin_detail
  });
}

ItemBegins.formDelete=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  ItemBegins.formEntry(indek,MODE_DELETE);
  ItemBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{ItemBegins.formLast(indek);});
    toolbar.delet(indek,()=>{ItemBegins.deleteExecute(indek);});
  });
}

ItemBegins.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "item_id":bingkai[indek].item_id
  });
}

ItemBegins.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>ItemBegins.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemBegins.formPaging(indek));
}

ItemBegins.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  ItemBegins.formResult(indek);
}

ItemBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ItemBegins.formSearch(indek);});
  db3.search(indek,()=>{
    ItemBegins.readShow(indek);
  });
}

ItemBegins.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  ItemBegins.formPaging(indek):
  ItemBegins.formResult(indek);
}

ItemBegins.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemBegins.formPaging(indek));
  ItemBegins.exportExecute(indek);
}

ItemBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'item_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

ItemBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ItemBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

ItemBegins.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;  
  
  for (var i=0;i<j;i++){
    o={
      "item_id":d[i][1],
      "begin_detail":d[i][2]
    }
    db3.query(indek,ItemBegins.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

ItemBegins.setRows=function(indek,isi){
  if(isi===undefined) isi=[];
  if(isi===null)isi=[];
  
  var panjang=isi.length;
  var html=ItemBegins.tableHead(indek);
  
  var sum_qty=0;
  var sum_total=0;
  
  bingkai[indek].begin_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'
      
      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="location_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].location_id+'" '
        +' onchange="ItemBegins.setCell(\''+indek+'\''
        +',\'location_id_'+i+'_'+indek+'\')"'
        +' onfocus="this.select()"'
        +' size="10">'
        +'</td>'
        
      +'<td><button type="button" id="btn_find" '
        +' onclick="Locations.lookUp(\''+indek+'\''
        +',\'location_id_'+i+'_'+indek+'\',\''+i+'\')">'
        +'</button></td>'

      +'<td style="padding:0;margin:0;" align="right">'
        +'<input type="text" id="quantity_'+i+'_'+indek+'"'
        +' value="'+isi[i].quantity+'"'
        +' onchange="ItemBegins.setCell(\''+indek+'\''
        +',\'quantity_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"'
        +' style="text-align:right" '
        +' size="5">'
        +'</td>'
        
      +'<td style="padding:0;margin:0;" align="right">'
        +'<input type="text" id="unit_cost_'+i+'_'+indek+'"'
        +' value="'+isi[i].unit_cost+'"'
        +' onchange="ItemBegins.setCell(\''+indek+'\''
        +',\'unit_cost_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" '
        +' style="text-align:right" '
        +' size="5">'
        +'</td>'

      +'<td style="padding:0;margin:0;" align="right">'
        +'<input type="text" id="total_cost_'+i+'_'+indek+'"'
        +' value="'+isi[i].total_cost+'" '
        +' onchange="ItemBegins.setCell(\''+indek+'\''
        +',\'total_cost_'+i+'_'+indek+'\')"  '
        +' onfocus="this.select()"'
        +' disabled'
        +' style="text-align:right" '
        +' size="9">'
        +'</td>'
      
      +'<td align="center">'
        +'<button type="button" id="btn_add" '
        +' onclick="ItemBegins.addRow(\''+indek+'\','+i+')" >'
        +'</button>'
        
      +'<button type="button" id="btn_remove"'
        +' onclick="ItemBegins.removeRow(\''+indek+'\','+i+')" >'
        +'</button>'
        +'</td>'

      +'</tr>';
    
    sum_qty+=parseFloat(isi[i].quantity);
    sum_total+=parseFloat(isi[i].total_cost);
    
  }
  html+=ItemBegins.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('begin_detail_'+indek).innerHTML=html;
  if(panjang==0) ItemBegins.addRow(indek,[]);
  
  document.getElementById('sum_qty_'+indek).innerHTML=sum_qty;
  document.getElementById('sum_total_'+indek).innerHTML=sum_total;
}

ItemBegins.tableHead=(indek)=>{
  return '<table id="myTable_'+indek+'" border=0 style="width:100%;" >'
    +'<thead>'
    +'<tr>'
    +'<th colspan="3">Location ID</th>'
    +'<th>Quantity</th>'
    +'<th>Unit Cost</th>'
    +'<th>Total Cost</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
    +'</thead>';
}

ItemBegins.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="3" style="text-align:right;">Total:</td>'
    +'<td style="text-align:right;font-weight:bolder;" '
      +' id="sum_qty_'+indek+'">0.00</td>'
    +'<td>&nbsp;</td>'
    +'<td style="text-align:right;font-weight:bolder;" '
      +' id="sum_total_'+indek+'">0.00</td>'
    +'<td>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

ItemBegins.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  var location_id=bingkai[indek].data_default.location_id;

  oldBasket=bingkai[indek].begin_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0)newRow(newBasket);
  ItemBegins.setRows(indek,newBasket);
  
  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.location_id=location_id;
    myItem.quantity=0;
    myItem.unit_cost=0;
    myItem.total_cost=0;
    newBas.push(myItem);    
  }
}

ItemBegins.removeRow=(indek,number)=>{
  var isiTabel=bingkai[indek].begin_detail;
  var newBasket=[];
  var amount=0;  
  ItemBegins.setRows(indek,isiTabel);
  for(var i=0;i<isiTabel.length;i++){
    if (i!=(number))newBasket.push(isiTabel[i]);
  }
  ItemBegins.setRows(indek,newBasket);
}

ItemBegins.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].begin_detail;
  var baru = [];
  var isiEdit = {};
  
  var sum_qty=0;
  var sum_total=0;

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('location_id_'+i+'_'+indek)){
      isiEdit.location_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('quantity_'+i+'_'+indek)){
      isiEdit.quantity=document.getElementById(id_kolom).value;
      isiEdit.total_cost=isiEdit.unit_cost*isiEdit.quantity;
      setEV('total_cost_'+i+'_'+indek,isiEdit.total_cost);
      baru.push(isiEdit);
    }
    else if(id_kolom==('unit_cost_'+i+'_'+indek)){
      isiEdit.unit_cost=document.getElementById(id_kolom).value;
      isiEdit.total_cost=isiEdit.unit_cost*isiEdit.quantity;
      setEV('total_cost_'+i+'_'+indek,isiEdit.total_cost);
      baru.push(isiEdit);
    }
    else if(id_kolom==('total_cost_'+i+'_'+indek)){
      isiEdit.total_cost=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
    
    sum_qty+=parseFloat(baru[i].quantity);
    sum_total+=parseFloat(baru[i].total_cost);
    
  }  

  document.getElementById('sum_qty_'+indek).innerHTML=sum_qty;
  document.getElementById('sum_total_'+indek).innerHTML=sum_total;
  
  bingkai[indek].begin_detail=isi;
}

ItemBegins.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
  ItemBegins.setCell(indek,id_kolom);
}

ItemBegins.setItem=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  setEV(id_kolom, data.item_id);
  ItemBegins.getItem(indek,id_kolom,nama_kolom); 
}

ItemBegins.getItem=(indek,id_kolom,baris)=>{
  Items.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    setEV('item_name_'+indek, paket.data.item_name);
  });
}
/*EOF*/
