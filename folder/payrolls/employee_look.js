/*
 * auth: budiono
 * date: sep-30, 07:05, sat-2023; new;
 * edit: oct-13, 07:54, thu-2023; builds;unbuilds;moves;adjustment;
 */ 
 
'use strict';

function EmployeeLook(indek_parent){
  function show(){
    const tiket=JSON.parse(JSON.stringify(bingkai[indek_parent]));
    tiket.parent=indek_parent;
    tiket.modul='employees';
    tiket.menu.name="Employees"
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
    toolbar.neuu(indek,()=>{objPop.formCreate(indek)});
    content.wait(indek);
    db3.readLook(indek,()=>{dataShow(indek);});
  }
  
  function dataShow(indek){
    const paket=bingkai[indek].paket;
    const metode=bingkai[indek].metode;
    var html ='<div style="padding:0.5rem;">'
      +content.title(indek)
      +'<div id="msg_'+indek+'" '
      +' style="margin-bottom:1rem;line-height:1.5rem;"></div>'
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
            +' onclick="objPop.gotoPage(\''+indek+'\',\''
            +paket.paging.pages[x].page+'\')" disabled >'
            +paket.paging.pages[x].page +'</button>';  
          } else {
            html+= '<button type="button" '
            +' onclick="objPop.gotoPage(\''+indek+'\',\''
            +paket.paging.pages[x].page+'\')">'
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
      +'<th colspan="2">Employee ID</th>'
      +'<th>Employee Name</th>'
      +'<th>Frequency</th>'
      +'<th>Select</th>';

    if (paket.err.id===0){
      for (var x in paket.data) {
        html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].employee_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].employee_name)+'</td>'
        +'<td align="center">'
          +array_pay_frequency[paket.data[x].pay_frequency]
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_select" '
          +' onclick="objPop.select(\''+indek+'\',\''+x+'\');">'
          +'</button>'
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
      case "employee_begins":
        EmployeeBegins.setEmployee(indek_parent,data[a]);
        break;
      case "builds":
        Builds.setEmployee(indek_parent,data[a]);
        break;
      case "unbuilds":
        Unbuilds.setEmployee(indek_parent,data[a]);
        break;
      case "moves":
        Moves.setEmployee(indek_parent,data[a]);
        break;
      case "adjustments":
        Adjustments.setEmployee(indek_parent,data[a]);
        break;

      default:
        alert('['+bingkai[indek_parent].menu.id+']'
          +' undefined in [employee_look.js]');
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
  
  function formCreate(indek){
    toolbar.none(indek);
    toolbar.back(indek,()=>{objPop.formPaging(indek);});
    toolbar.save(indek,()=>{objPop.createExecute(indek);});
    formEntry(indek,MODE_CREATE);
  }
  
  function formEntry(indek, metode){
    bingkai[indek].metode=metode;
    var html=''
    +'<div style="padding:0.5rem">'
      +content.title(indek)
      +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
      +'<form autocomplete="off" style="padding-bottom:10rem;">'
        +'<ul>'
          +'<li><label>Employee ID:<i class="required"> *</i></label>'
            +'<input type="text"'
            +' id="employee_id_'+indek+'">'
          +'</li>'
          +'<li><label>Name</label>'
            +'<input type="text"'
            +' id="employee_name_'+indek+'">'
          +'</li>'
          +'<li><label>Class</label>'
            +'<select id="employee_class_'+indek+'">'
            +getEmployeeClass(indek)
            +'</select>'
          +'</i>'
        +'</ul>'
      +'</form>'
    +'</div>'
    content.html(indek,html);
    statusbar.ready(indek);
  }
  
  function createExecute(indek){
    
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
  this.formCreate=(indek)=>{formCreate(indek);}
  this.createExecute=(indek)=>{createExecute(indek);}
}
/*EOF*/
