/*
 * name: budiono
 * date: oct-02, 16:31, mon-2023; new;
 * edit: oct-16, 09:42, mon-2023; 
 */

'use strict';

var CustomerBalances={
  url:'customer_balances',
  title: 'Customer Balances'
}

CustomerBalances.show=(karcis)=>{
  karcis.modul=CustomerBalances.url;
  karcis.menu.name=CustomerBalances.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    var newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    CustomerBalances.formPaging(indek);
  }else{
    show(baru);
  }
}

CustomerBalances.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>CustomerBalances.formSearch(indek));
  toolbar.refresh(indek,()=>CustomerBalances.formPaging(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    CustomerBalances.readShow(indek);
  });
}

CustomerBalances.readShow=(indek)=>{
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
        +' onclick="CustomerBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="CustomerBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled >'+paket.paging.pages[x].page
          +'</button>';
        } else {
          html+= '<button type="button"'
          +' onclick="CustomerBalances.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +'>'+paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="CustomerBalances.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Customer ID</th>'
    +'<th>Name</th>'
    +'<th>Amount Due</th>'
    +'<th>Action</th>'
    +'</tr>';
    
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td>'+paket.data[x].customer_id+'</td>'
        +'<td>'+xHTML(paket.data[x].customer_name)+'</td>'
        +'<td align="right">'+paket.data[x].amount+'</td>'

        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="CustomerBalances.formDetail(\''+indek+'\''
          +',\''+paket.data[x].customer_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

CustomerBalances.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  CustomerBalances.formPaging(indek);
}

CustomerBalances.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  CustomerBalances.formPaging(indek):
  CustomerBalances.formResult(indek);
}

CustomerBalances.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>CustomerBalances.formSearch(indek));
  db3.search(indek,(paket)=>{
    CustomerBalances.readShow(indek);
  });
}

CustomerBalances.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>CustomerBalances.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>CustomerBalances.formPaging(indek));
}

CustomerBalances.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  CustomerBalances.formResult(indek);
}

CustomerBalances.formDetailC=(indek,invoice_no)=>{
  bingkai[indek].invoice_no=invoice_no;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{CustomerBalances.read(indek);});
  toolbar.back(indek,()=>CustomerBalances.formLast(indek));
  CustomerBalances.read(indek);
}

CustomerBalances.read=(indek)=>{
  var html='';
  //db3.read3(indek,{
  db3.query(indek,CustomerBalances.url+'/read', {
    "customer_id":bingkai[indek].customer_id,
    "invoice_no":bingkai[indek].invoice_no,
  },(ironman)=>{
    var html;
    if (ironman.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br />'
        +'<div'
          +' style="display:grid;'
          +'grid-template-columns:repeat(2,1fr);padding-bottom:20px;">'
        +'<div>'
          +'<ul>'
            +'<li><label>Customer ID</label>: '+ironman.data.customer_id+'</li>'
            +'<li><label>Name</label>: '+xHTML(ironman.data.customer_name)+'</li>'
          +'</ul>'
        +'</div>'
        
        +'<div>'
          +'<ul>'
            +'<li><label>Invoice No.</label>: '+ironman.data.invoice_no+'</li>'
            +'<li><label>Date.</label>: '+tglWest(ironman.data.invoice_date)+'</li>'
            +'<li><label>Amount</label>: '+ironman.data.invoice_amount+'</li>'
            +'<li><label>Amount Due</label>: '+ironman.data.amount_due+'</li>'
          +'</ul>'
        +'</div>'
        +'</div>'

        +'<table>'
        +'<tr>'
          +'<th colspan="2">Number</th>'
          +'<th>Date</th>'
          +'<th>Receipt Amount</th>'
          +'<th>Credit Amount</th>'
          +'<th>Amount Due</th>'
          +'<th>Modul ID</th>'
          +'<th>Action</th>'
        +'</tr>';

      var list1=ironman.data.by_modul;
      var invoice_amount=0;
      var amount_paid=0;
      var amount_due=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="left">'+list1[x].number+'</td>'
        +'<td align="center">'+tglWest(list1[x].date)+'</td>'
        +'<td align="right">'+list1[x].receipt_amount+'</td>' 
        +'<td align="right">'+list1[x].credit_amount+'</td>' 
        +'<td align="right">'+list1[x].amount_due+'</td>' 
        +'<td align="right">'+list1[x].modul_id+'</td>' 
        +'<td align="center">'
          +'<input type="button" value="Delete"'
          +' onclick="CustomerBalances.removeExecute(\''+indek+'\''
          +',\''+list1[x].modul_id+'\''
          +',\''+list1[x].blok_id+'\''
          +')">'
          +'</td>'
        +'</tr>'
        invoice_amount+=Number(list1[x].invoice_amount);
        amount_paid+=Number(list1[x].amount_paid);
        amount_due+=Number(list1[x].amount_due);
      }
      
      html+='<tr>'
        +'<td colspan="5" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+ironman.data.amount_due+'</b></td>'
        // +'<td colspan="2">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';
      
      content.html(indek,html);
    }else{
      content.infoPaket(indek,ironman);
    }
  });
}

CustomerBalances.formDetail=(indek,customer_id)=>{
  bingkai[indek].customer_id=customer_id;
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>{CustomerBalances.readOne(indek);});
  toolbar.back(indek,()=>CustomerBalances.formLast(indek));
  CustomerBalances.readOne(indek);
}

CustomerBalances.readOne=(indek)=>{
  var html='';
  db3.readOne(indek,{
    "customer_id":bingkai[indek].customer_id
  },(ironman)=>{
    var html;
    if (ironman.err.id===0){
      bingkai[indek].metode=MODE_VIEW;
      
      html='<div style="padding:0.5rem;">'
        +content.title(indek)
        +'<div id="msg_'+indek+'"></div>'
        +'<br />'
        +'<ul>'
          +'<li><label>Customer ID</label>: '+ironman.data.customer_id+'</li>'
          +'<li><label>Name</label>: '+xHTML(ironman.data.customer_name)+'</li>'
        +'</ul>'
        +'<table>'
        +'<tr>'
          +'<th colspan="2">Date</th>'
          +'<th>Invoice<br>Number</th>'
          +'<th>Invoice<br>Amount</th>'
          +'<th>Amount<br>Paid</th>'
          +'<th>Amount<br>Due</th>'
          +'<th>Status</th>'
        +'</tr>';

      var list1=ironman.data.by_modul;
      var invoice_amount=0;
      var amount_paid=0;
      var amount_due=0;
      
      for (var x in list1) {
        html+='<tr>'
        +'<td align="center">'+list1[x].row_id+'</td>'
        +'<td align="center">'+tglWest(list1[x].invoice_date)+'</td>'
        +'<td align="left">'+list1[x].invoice_no+'</td>'
        +'<td align="right">'+list1[x].invoice_amount+'</td>'
        +'<td align="right">'+list1[x].amount_paid+'</td>'
        +'<td align="right">'+list1[x].amount_due+'</td>' 
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_detail"'
          +' onclick="CustomerBalances.formDetailC(\''+indek+'\''
          +',\''+list1[x].invoice_no+'\')">'
          +'</button>'
          +'</td>'
        +'</tr>'
        invoice_amount+=Number(list1[x].invoice_amount);
        amount_paid+=Number(list1[x].amount_paid);
        amount_due+=Number(list1[x].amount_due);
      }
      
      html+='<tr>'
        +'<td colspan="3" align="right"><b>Balance:</b></td>'
        +'<td align="right"><b>'+invoice_amount+'</b></td>'
        +'<td align="right"><b>'+amount_paid+'</b></td>'
        +'<td align="right"><b>'+amount_due+'</b></td>'
        +'<td colspan="2">&nbsp;</td>'
        +'</tr>'
        +'</table></div>';
      content.html(indek,html);
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

CustomerBalances.removeExecute=(indek,modul_id,blok_id)=>{
  db3.deleteOne(indek,{
    "modul_id":modul_id,
    "blok_id":blok_id
  });
}

// eof;
