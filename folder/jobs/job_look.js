/*
 * name: budiono;
 * date: sep-28, 22:52, thu-2023; new;
 * edit: oct-14, 20:01, sat-2023; 
 * edit: oct-19, 22:19, thu-2023; xHTML;
 */ 
 
'use strict';

Jobs.lookUp=(indek,id_kolom,nama_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  bingkai[indek].nama_kolom=nama_kolom;

  objPop=new JobLook(indek);
  objPop.show();
}

function JobLook(indek_parent,other){
  function show(){
    const tiket=JSON.parse(JSON.stringify(bingkai[indek_parent]));
    tiket.parent=indek_parent;
    tiket.modul='jobs';
    tiket.menu.name="Jobs"
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
    const nama_kolom=bingkai[indek].nama_kolom;// -2=show job only
    
    var html ='<div style="padding:0.5rem;">'
      +'<div id="msg_'+indek+'"></div>'
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
      +'<th>Job ID</th>'
      +'<th>Job Name</th>'
      +'<th>Select</th>';

    if (paket.err.id===0){
      for (var x in paket.data) {
        html+='<tr>'
        +'<td align="left">';
          if(nama_kolom==-2){
            // no phases, no cost, job only;
          }else{
            if(paket.data[x].use_phases==1){
              html+='<input type="button" '
              +' id="btn_phase_'+x+'_'+indek+'"'
              +' value="+" '
              +' onclick="objPop.phaseLook(\''+indek+'\',\''+x+'\');">'
            }else{
              html+='<input type="button" value="-" disabled>&nbsp;';
            }
          }
          html+=paket.data[x].job_id
          +'<input type="hidden" '
          +' id="job_id_'+x+'_'+indek+'"'
          +' value="'+paket.data[x].job_id+'">'
          +'</td>'

        +'<td align="left">'+xHTML(paket.data[x].job_name)+'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_select" '
          +' onclick="objPop.select(\''+indek+'\''
          +',\'job_id_'+x+'_'+indek+'\');"></button>'
          +'</td>'
        +'</tr>';

        if(paket.data[x].use_phases==1){
          html+='<tr '
            +' id="tr_'+x+'_'+indek+'"'
            +' style="display:none;">'
            +'<td colspan="3">'
            +'<div id="phase_look_'+x+'_'+indek+'"'
            +' style="padding-left:10px;"></div>'
            +'</td></tr>'
        }
      }
    }
    html+='</table>'
      +'</div>'
      +'</div>'
      +'</div>';
    content.html(indek,html);
    if(paket.err.id!=0) content.infoPaket(indek,paket);
  }
  
  function select(indek,id_kolom){
    const data=getEV(id_kolom);
    const indek_parent=bingkai[indek].parent;

    switch(bingkai[indek_parent].menu.id){
      case "job_begins":
        JobBegins.setJob(indek_parent,data);
        break;
      case "journal_entry":
        JournalEntry.setJob(indek_parent,data);
        break;
      case "adjustments":
        Adjustments.setJob(indek_parent,data);
        break;
        
      default:
        alert('['+bingkai[indek_parent].menu.id+']'
          +' undefined in [job_look.js]');
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
  
  function phaseLook(indek,baris){
    if(document.getElementById('btn_phase_'+baris+'_'+indek).value=="-"){
      document.getElementById('btn_phase_'+baris+'_'+indek).value='+';
      document.getElementById('phase_look_'+baris+'_'+indek).innerHTML='';
      document.getElementById('tr_'+baris+'_'+indek).style.display="none";
      return;
    }else{
      document.getElementById('btn_phase_'+baris+'_'+indek).value='-';
      document.getElementById('tr_'+baris+'_'+indek).style.display="table-row";
    }
    
    Phases.getPaging(indek,(paket)=>{
      var phase_id='';
      var html='<table border=1 style="padding:10px;">'
      if (paket.err.id===0){
        for (var x in paket.data) {
          phase_id=getEV("job_id_"+baris+"_"+indek)+','
            +paket.data[x].phase_id;
            
          html+='<tr>'
          +'<td align="left">';
            
            if(paket.data[x].use_cost==1){
              html+='<input type="button" '
              +' id="btn_cost_'+x+'_'+indek+'"'
              +' value="+" '
              +' onclick="objPop.costLook(\''+indek+'\',\''+x+'\');">';
            }else{
              html+='<input type="button" value="-" disabled>&nbsp;';
            }
            html+=paket.data[x].phase_id;
            // var 
            html+='<input type="hidden" id="phase_id_'+x+'_'+indek+'"'
            +' value="'+phase_id+'">'
            +'</td>'
          +'<td align="left">'+xHTML(paket.data[x].phase_name)+'</td>'

          +'<td align="center">';
            if(paket.data[x].use_cost==0){
              html+='<button type="button" '
              +' id="btn_select" '
              +' onclick="objPop.select(\''+indek+'\''
              +',\'phase_id_'+x+'_'+indek+'\');"></button>';
            }
            html+='</td>'
          +'</tr>';
          
          if(paket.data[x].use_cost==1){
            html+='<tr '
              +' id="tr2_'+x+'_'+indek+'"'
              +' style="display:none;">'
              +'<td colspan="3">'
              +'<div id="cost_look_'+x+'_'+indek+'"'
              +' style="padding-left:10px;"></div>'
              +'</td></tr>'
          }
        }
      }
      html+='</table>';
      document.getElementById('phase_look_'+baris+'_'+indek).innerHTML=html;
      if(paket.err.id!=0) content.infoPaket(indek,paket);
    });
  }
  
  function costLook(indek,baris){
    if(document.getElementById('btn_cost_'+baris+'_'+indek).value=="-"){
      document.getElementById('btn_cost_'+baris+'_'+indek).value='+';
      document.getElementById('cost_look_'+baris+'_'+indek).innerHTML='';
      document.getElementById('tr2_'+baris+'_'+indek).style.display="none";
      return;
    }else{
      document.getElementById('btn_cost_'+baris+'_'+indek).value='-';
      document.getElementById('tr2_'+baris+'_'+indek).style.display="table-row";
    }
    
    Costs.getPaging(indek,(paket)=>{
      var cost_id='';
      var html='<table border=1 style="padding:10px;">'
      if (paket.err.id===0){
        for (var x in paket.data) {
          cost_id=getEV("phase_id_"+baris+"_"+indek)+','
            +paket.data[x].cost_id;
            
          html+='<tr>'
          +'<td align="left">'
            +paket.data[x].cost_id
            
            +'<input type="hidden" id="cost_id_'+x+'_'+indek+'"'
            +' value="'+cost_id+'">'
            
            +'</td>'
          +'<td align="left">'+xHTML(paket.data[x].cost_name)+'</td>'

          +'<td align="center">';
            html+='<button type="button" '
            +' id="btn_select" '
            +' onclick="objPop.select(\''+indek+'\''
            +',\'cost_id_'+x+'_'+indek+'\');"></button>'
            +'</td>'
          +'</tr>';
        }
      }
      html+='</table>';
      document.getElementById('cost_look_'+baris+'_'+indek).innerHTML=html;
      if(paket.err.id!=0) content.infoPaket(indek,paket);
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
  this.phaseLook=(indek,baris)=>{phaseLook(indek,baris);}
  this.costLook=(indek,baris)=>{costLook(indek,baris);}
}
/*EOF*/
