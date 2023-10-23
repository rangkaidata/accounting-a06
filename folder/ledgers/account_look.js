/*
 * auth: budiono
 * date: sep-11, 11:48, mon-2023; new: 251;
 * edit: sep-12, 12:07, tue-2023; 
 * edit: sep-19, 21:08, tue-2023;
 * edit: sep-25, 15:36, mon-2023; 
 * edit: sep-27, 13:46, wed-2023; account_begins;
 * edit: sep-28, 17:46, thu-2023; customer_begins;
 * edit: oct-04, 17:51, wed-2023; vendor_begins;
 * edit: oct-12, 09:43, thu-2023; 
 */ 
 
'use strict';

function AccountLook(indek_parent){
  
  function show(){

    const tiket=JSON.parse(JSON.stringify(bingkai[indek_parent]));
    tiket.parent=indek_parent;
    tiket.modul='account';
    tiket.menu.name="Chart Accounts"
    tiket.ukuran.lebar=60;
    tiket.ukuran.tinggi=40;
    tiket.bisa.ubah=0;
    tiket.letak.atas=0;
    
    const newReg=new BingkaiSpesial(tiket);
    const indek=newReg.show();
    
    formPaging(indek);
  }
  
  function formPaging(indek){
    toolbar.none(indek);
    toolbar.cancel(indek,()=>{ui.CLOSE_POP(indek)});
    toolbar.search(indek,()=>{objPop.formSearch(indek)});
    content.wait(indek);
    db3.readLook(indek,()=>{dataShow(indek);});
  }
  
  function dataShow(indek){
    const paket=bingkai[indek].paket;
    const metode=bingkai[indek].metode;
    var html ='<div style="padding:0.5rem;">'
      +content.title(indek)
      +'<p>Total: '+paket.count+' rows</p>';

    if (paket.err.id===0){
      if (metode==MODE_READ){
        if (paket.paging.first!=""){
          html+= '<button type="button"'
          +' id="btn_first"'
          +' onclick="objPop.gotoPage(\''+indek+'\''
          +',\''+paket.paging.first+'\')">'
          +'</button>';
        }
        for (x in paket.paging.pages){
          if (paket.paging.pages[x].current_page=="yes"){
            html+= '<button type="button"'
            +' onclick="objPop.gotoPage(\''+indek+'\''
            +',\''+paket.paging.pages[x].page+'\')" disabled >'
            +paket.paging.pages[x].page
            +'</button>';  
          } else {
            html+= '<button type="button"'
            +' onclick="objPop.gotoPage(\''+indek+'\''
            +',\''+paket.paging.pages[x].page+'\')">'
            +paket.paging.pages[x].page
            +'</button>'; 
          }
        }
        if (paket.paging.last!=""){
          html+='<button type="button" id="btn_last" '
          +' onclick="objPop.gotoPage(\''+indek+'\''
          +',\''+paket.paging.last+'\')">'
          +'</button>';
        }
      }
    }

    html+='<table border=1 style="padding:10px;">'
      +'<th>Account ID</th>'
      +'<th>Account Name</th>'
      +'<th>Account Class</th>'
      +'<th>Select</th>';

    if (paket.err.id===0){
      var d=paket.data;
      for (var x in d) {
        html+='<tr>'
        +'<td>'+d[x].account_id+'</td>'
        +'<td>'+xHTML(d[x].account_name)+'</td>'
        +'<td align="center">'
          +array_account_class[d[x].account_class]
          +'</td>'
          
        +'<td align="center"><button type="button" '
          +' id="btn_select" '
          +' onclick="objPop.select(\''+indek+'\',\''+x+'\');">'
          +' </button>'
          +'</td>'
          
        +'</tr>';
      }
    }
    html+='</table>'
      +'</div>'
      +'</div>'
      +'</div>';
    content.html(indek,html);
    if(paket.err.id!=0) content.infoPaket(indek,paket);
  }
  
  function select(indek,row){
    const data=bingkai[indek].paket.data;
    const indek_parent=bingkai[indek].parent;

    switch(bingkai[indek_parent].menu.id){
      case "item_defaults":
        ItemDefaults.setAccount(indek_parent,data[row]);
        break;
      case "items":
        Items.setAccount(indek_parent,data[row]);
        break;
      case "vendor_defaults":
        VendorDefaults.setAccount(indek_parent,data[row]);
        break;
      case "vendors":
        Vendors.setAccount(indek_parent,data[row]);
        break;
      case "customer_defaults":
        CustomerDefaults.setAccount(indek_parent,data[row]);
        break;
      case "customers":
        Customers.setAccount(indek_parent,data[row]);
        break;
      case "employee_defaults":
        EmployeeDefaults.setAccount(indek_parent,data[row]);
        break;
      case "sales_taxes":
        SalesTax.setAccount(indek_parent,data[row]);
        break;
      case "employees":
        Employees.setAccount(indek_parent,data[row]);
        break;
      case "rpt_chart_01":
        RptChart01.setAccount(indek_parent,data[row]);
        break;
      case "account_begins":
        AccountBegins.setAccount(indek_parent,data[row]);
        break;
      case "customer_begins":
        CustomerBegins.setAccount(indek_parent,data[row]);
        break;
      case "employee_begins":
        EmployeeBegins.setAccount(indek_parent,data[row]);
        break;
      case "vendor_begins":
        VendorBegins.setAccount(indek_parent,data[row]);
        break;
      case "journal_entry":
        JournalEntry.setAccount(indek_parent,data[row]);
        break;        
      case "adjustments":
        Adjustments.setAccount(indek_parent,data[row]);
        break;        

      default:
        alert('['+bingkai[indek_parent].menu.id+']'
          +' undefined in [account_look.js]');
    }

    ui.CLOSE_POP(indek);
  }
  
  function formSearch(indek){
    bingkai[indek].metode=MODE_SEARCH;
    content.search(indek,()=>objPop.searchExecute(indek));
    toolbar.none(indek);
    toolbar.back(indek,()=>{objPop.formPaging(indek);});
  }
  
  function searchExecute(indek){
    bingkai[indek].text_search=getEV('text_search_'+indek);
    formResult(indek);
  }
  
  function formResult(indek){
    toolbar.none(indek);
    toolbar.back(indek,()=>{objPop.formSearch(indek);});
    db3.search(indek,()=>{
      dataShow(indek);
    });
  }
  
  this.gotoPage=(indek,ini)=>{
    bingkai[indek].page=ini;
    formPaging(indek);
  }
  
  this.show=()=>{show()};
  this.select=(indek,row)=>{select(indek,row)};
  this.formSearch=(indek)=>{formSearch(indek);}
  this.formPaging=(indek)=>{formPaging(indek);}
  this.searchExecute=(indek)=>{searchExecute(indek);}
}
// eof: 251;
