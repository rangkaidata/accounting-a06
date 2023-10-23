/*
 * name: budiono
 * new : sep-06, 21:09, wed-2023; new 
 * edit: sep-11, 11:25, mon-2023; add calculate
 * edit: sep-19, 21:17, tue-2023; 
 */ 
 
'use strict';

function ItemTaxesLook(indek_parent){
  function show(){
    const tiket=JSON.parse(JSON.stringify(bingkai[indek_parent]));
    tiket.parent=indek_parent;
    tiket.modul='item_taxes';
    tiket.menu.name="Item Taxes"
    tiket.ukuran.lebar=60;
    tiket.ukuran.tinggi=40;
    tiket.bisa.ubah=0;
    tiket.letak.atas=0;
    
    const newReg=new BingkaiSpesial(tiket);
    const indek=newReg.show();    
    formLook(indek);
  }
  
  function formLook(indek){
    toolbar.none(indek);
    toolbar.search(indek,()=>{objPop.formSearch(indek)});
    toolbar.cancel(indek,()=>{ui.CLOSE_POP(indek)});

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
          +' id="btn_first" '
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
          html+='<button type="button"'
          +' id="btn_last" '
          +' onclick="objPop.gotoPage(\''+indek+'\''
          +',\''+paket.paging.last+'\')">'
          +'</button>';
        }
      }
    }

    html+='<table border=1 style="padding:10px;">'
      +'<th>Item Tax ID</th>'
      +'<th>Item Tax Name</th>'
      +'<th>Taxable</th>'
      +'<th>Select</th>';

    if (paket.err.id===0){
      for (var x in paket.data) {
        html+='<tr>'
        +'<td align="left">'+paket.data[x].item_tax_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].item_tax_name)+'</td>'
        +'<td align="left">'+paket.data[x].item_tax_calculate+'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_select" '
          +' onclick="objPop.select(\''+indek+'\''
          +',\''+x+'\');"></button>'
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
  
  function select(indek,a){
    const data=bingkai[indek].paket.data;
    const indek_parent=bingkai[indek].parent;

    switch(bingkai[indek_parent].menu.id){
      case "items":
        Items.setItemTaxes(indek_parent,data[a]);
        break;
      case "item_defaults":
        ItemDefaults.setItemTaxes(indek_parent,data[a]);
        break;
        
      default:
        alert('['+bingkai[indek_parent].menu.id+']'
          +' undefined [item_tax_look.js].');
    }
    ui.CLOSE_POP(indek);
  }
  
  function formSearch(indek){
    bingkai[indek].metode=MODE_SEARCH;
    content.search(indek,()=>objPop.searchExecute(indek));
    toolbar.none(indek);
    toolbar.back(indek,()=>{objPop.formLook(indek);});
  }
  
  function searchExecute(indek){
    bingkai[indek].text_search=getEV('text_search_'+indek);
    formResult(indek);
  }
  
  function formResult(indek){
    toolbar.none(indek);
    toolbar.back(indek,()=>{objPop.formSearch(indek);});
    db3.search(indek,(paket)=>{
      dataShow(indek);
    });
  }
  
  this.gotoPage=(indek,ini)=>{
    bingkai[indek].page=ini;
    formLook(indek);
  }
  
  this.show=()=>{show()};
  this.select=(indek,a)=>{select(indek,a)};
  this.formSearch=(indek)=>{formSearch(indek);}
  this.formLook=(indek)=>{formLook(indek);}
  this.searchExecute=(indek)=>{searchExecute(indek);}
}
// eof: 151;
