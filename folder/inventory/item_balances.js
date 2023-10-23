/*
 * name: budiono
 * date: oct-02, 17:25, mon-2023; new;
 * edit: oct-15, 19:50, sun-2023; 
 * edit: oct-16, 10:03, mon-2023; 
 */ 

'use strict';

var ItemBalances={
  title:'Item Balances',
  url:'item_balances'
}

ItemBalances.show=(karcis)=>{
  karcis.modul=ItemBalances.url;
  karcis.menu.name=ItemBalances.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    ItemBalances.formPaging(indek);
  }else{
    show(baru);
  }
}

ItemBalances.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>{ItemBalances.formSearch(indek);});
  toolbar.refresh(indek,()=>{ItemBalances.formPaging(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});  
  db3.readPaging(indek,()=>{
    ItemBalances.readShow(indek);
  });
}

ItemBalances.readShow=(indek)=>{
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
        +' onclick="ItemBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="ItemBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="ItemBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="ItemBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="3">Description</th>'
    +'<th>Item ID</th>'
    +'<th>Quantity</th>'
    +'<th>Unit Cost</th>'
    +'<th>Total Cost</th>'  
    +'<th>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    var d=paket.data;
    for (var x in d) {
      html+='<tr>'
        +'<td align="center">'+d[x].row_id+'</td>'
        +'<td align="left">'+d[x].location_id+'</td>'
        +'<td align="left">'+xHTML(d[x].item_name)+'</td>'
        +'<td align="left">'+d[x].item_id+'</td>'
        
        +'<td align="right">'+d[x].quantity+'</td>'
        +'<td align="right">'+d[x].unit_cost+'</td>'
        +'<td align="right">'+d[x].total_cost+'</td>'
          
        +'<td align="center"><button type="button" id="btn_detail" '
          +' onclick="ItemBalances.formView(\''+indek+'\''
          +',\''+d[x].item_id+'\''
          +',\''+d[x].location_id+'\''
          +');"></button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

ItemBalances.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  ItemBalances.formPaging(indek);
}

ItemBalances.formView=(indek,item_id,location_id)=>{
  bingkai[indek].item_id=item_id;
  bingkai[indek].location_id=location_id;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{ItemBalances.readOne(indek);});
  toolbar.back(indek,()=>ItemBalances.formLast(indek));
  ItemBalances.readOne(indek);
}

ItemBalances.readOne=(indek)=>{
  var html='';
  db3.readOne(indek,{
    "item_id":bingkai[indek].item_id,
    "location_id":bingkai[indek].location_id
  },(paket)=>{
    var html;
    var d=paket.data;
    if (paket.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br/>'
        +'<ul>'
          +'<li><label>Item ID</label>: '+d.item_id+'</li>'
          +'<li><label>Description</label>: '+xHTML(d.item_name)+'</li>'
          +'<li><label>Location ID</label>: '+d.location_id+'</li>'
        +'</ul>'
        +'<table>'
        +'<tr>'
          +'<th rowspan="2" colspan="2">Date</th>'
          +'<th rowspan="2" >Reference<br>Number</th>'
          +'<th rowspan="1" colspan="3">Cost</th>'
          +'<th rowspan="1" colspan="2">Remain</th>'
          +'<th rowspan="2">Source</th>'
          +'<th rowspan="2">Status</th>'
        +'</tr>'
        +'<tr>'
          +'<th>Quantity</th>'
          +'<th>Unit</th>'
          +'<th>Total</th>'
          +'<th>Quantity</th>'
          +'<th>Value</th>'

        +'</tr>';

      var list1=d.by_modul;
      var remain_qty=0;
      var remain_value=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="center">'+tglWest(list1[x].balance_date)+'</td>'
        +'<td align="left">'+list1[x].balance_no+'</td>'
        +'<td align="right">'+list1[x].quantity+'</td>'
        +'<td align="right">'+list1[x].unit_cost+'</td>'
        +'<td align="right">'+list1[x].total_cost+'</td>' 
        +'<td align="right">'+list1[x].remain_qty+'</td>' 
        +'<td align="right">'+list1[x].remain_value+'</td>' 
        +'<td align="left">'+list1[x].modul_id+'</td>'
        +'<td align="center"><input type="button" value="Verify"'
          +' onclick="ItemBalances.itemVerify(\''+indek+'\''
          +',\''+list1[x].modul_id+'\''
          +',\''+list1[x].blok_id+'\')">'
          +'</td>'
        +'</tr>'
        remain_qty+=Number(list1[x].quantity);
        remain_value+=Number(list1[x].total_cost);
      }
      
      html+='<tr>'
        +'<td colspan="6" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+remain_qty+'</b></td>'
        +'<td align="right"><b>'+remain_value+'</b></td>'
        +'<td colspan="2">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';
      
      content.html(indek,html);
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

ItemBalances.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>ItemBalances.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemBalances.formPaging(indek));
}

ItemBalances.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  ItemBalances.formResult(indek);
}

ItemBalances.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemBalances.formSearch(indek));
  db3.search(indek,()=>{
    ItemBalances.readShow(indek);
  });
}

ItemBalances.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  ItemBalances.formPaging(indek):
  ItemBalances.formResult(indek);
}

ItemBalances.itemVerify=(indek,modul_id,blok_id)=>{
  db3.deleteOne(indek,{
    "modul_id":modul_id,
    "blok_id":blok_id
//    "balance_no":balance_no,
//    "location_id":bingkai[indek].location_id,
//    "item_id":bingkai[indek].item_id
  });
}

// eof:
