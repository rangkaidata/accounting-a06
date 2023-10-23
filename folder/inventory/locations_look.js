/*
 * name: budiono
 * date: sep-11, 11:40, mon-2023; new;
 * edit: sep-16, 15:03, sat-2023; items;
 * edit: sep-19, 21:04, tue-2023;
 * edit: sep-29, 11:22, fri-2023; item_begins;
 * edit: oct-13, 07:50, fri-2023; builds;unbuilds;moves;adjustment
 */ 
 
'use strict';

function LocationLook(indek_parent){
  function show(){
    const tiket=JSON.parse(JSON.stringify(bingkai[indek_parent]));
    tiket.parent=indek_parent;
    tiket.modul='locations';
    tiket.menu.name="Item Locations"
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
          +' id="btn_first" onclick="objPop.gotoPage(\''+indek+'\''
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
            html+= '<button type="button" '
            +' onclick="objPop.gotoPage(\''+indek+'\''
            +',\''+paket.paging.pages[x].page+'\')">'
            +paket.paging.pages[x].page
            +'</button>'; 
          }
        }
        if (paket.paging.last!=""){
          html+='<button type="button"'
          +' id="btn_last" onclick="objPop.gotoPage(\''+indek+'\''
          +',\''+paket.paging.last+'\')">'
          +'</button>';
        }
      }
    }

    html+='<table border=1 style="padding:10px;">'
      +'<th>Location ID</th>'
      +'<th>Location Name</th>'
      +'<th>Select</th>';

    if (paket.err.id===0){
      for (var x in paket.data) {
        html+='<tr>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].location_name)+'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_select" '
          +' onclick="objPop.select(\''+indek+'\',\''+x+'\');">'
          +'</button></td>'
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
      case "item_defaults":
        ItemDefaults.setLocation(indek_parent,data[a]);
        break;
      case "items":
        Items.setLocation(indek_parent,data[a]);
        break;
      case "item_begins":
        ItemBegins.setLocation(indek_parent,data[a]);
        break;
      case "builds":
        Builds.setLocation(indek_parent,data[a]);
        break;
      case "unbuilds":
        Unbuilds.setLocation(indek_parent,data[a]);
        break;
      case "moves":
        Moves.setLocation(indek_parent,data[a]);
        break;
      case "adjustments":
        Adjustments.setLocation(indek_parent,data[a]);
        break;

      default:
        alert('['+bingkai[indek_parent].menu.id
          +'] undefined in [locations_look.js].');
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
    db3.search(indek,(paket)=>{
      dataShow(indek);
    });
  }
  
  this.gotoPage=(indek,ini)=>{
    bingkai[indek].page=ini;
    formPaging(indek);
  }
  
  this.show=()=>{show()};
  this.select=(indek,a)=>{select(indek,a)};
  this.formSearch=(indek)=>{formSearch(indek);}
  this.formPaging=(indek)=>{formPaging(indek);}
  this.searchExecute=(indek)=>{searchExecute(indek);}
}
// 150; 
