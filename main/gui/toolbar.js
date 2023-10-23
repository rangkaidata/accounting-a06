/*
 * auth: budiono
 * date: aug-31, 09:12, thu-2023; new; 13;
 * edit: sep-04, 21:52, mon-2023; add;126;
 * edit: sep-06, 21:14, wed-2023; 
 * edit: sep-25, 12:41, 
 */

'use strict';

toolbar.hide=function(indek){
  document.getElementById("frm_toolbar_hide_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_hide_"+indek).onclick=function(){
    ui.hideMe(indek);
  }
}

toolbar.none=function(indek){
  document.getElementById("frm_toolbar_hide_"+indek).style.display="none";
  document.getElementById("frm_toolbar_back_"+indek).style.display="none";
  document.getElementById("frm_toolbar_refresh_"+indek).style.display="none";
  document.getElementById("frm_toolbar_new_"+indek).style.display="none";
  document.getElementById("frm_toolbar_save_"+indek).style.display="none";
  document.getElementById("frm_toolbar_search_"+indek).style.display="none";
  document.getElementById("frm_toolbar_more_"+indek).style.display="none";
  document.getElementById("frm_toolbar_delete_"+indek).style.display="none";
  document.getElementById("frm_toolbar_export_"+indek).style.display="none";
  document.getElementById("frm_toolbar_import_"+indek).style.display="none";
  document.getElementById("frm_toolbar_edit_"+indek).style.display="none";
  document.getElementById("frm_toolbar_cancel_"+indek).style.display="none";    
  /*
  document.getElementById("frm_toolbar_preview_"+indek).style.display="none";
  document.getElementById("frm_toolbar_convert_"+indek).style.display="none";
  document.getElementById("frm_toolbar_void_"+indek).style.display="none";*/
}

toolbar.refresh=function(indek,func){
  document.getElementById("frm_toolbar_refresh_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_refresh_"+indek).onclick=func;
}

toolbar.search=function(indek,func){
  document.getElementById("frm_toolbar_search_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_search_"+indek).onclick=func;
}

toolbar.wait=function(nomer,display){
  document.getElementById("frm_toolbar_back_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_refresh_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_new_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_save_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_search_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_more_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_delete_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_export_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_import_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_edit_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_cancel_"+nomer).disabled=display;
      
  /*
  document.getElementById("frm_toolbar_preview_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_convert_"+nomer).disabled=display;
  document.getElementById("frm_toolbar_void_"+nomer).disabled=display;*/
}

toolbar.neuu=function(indek,func){
  document.getElementById("frm_toolbar_new_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_new_"+indek).onclick=func;
}

toolbar.neuu.display=function(indek){
  document.getElementById("frm_toolbar_new_"+indek).style.display="inline";
}

toolbar.more=function(indek,func){
  document.getElementById("frm_toolbar_more_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_more_"+indek).onclick=func;
}

toolbar.back=function(indek,func){
  document.getElementById("frm_toolbar_back_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_back_"+indek).onclick=func;
}

toolbar.save=function(indek,func){
  document.getElementById("frm_toolbar_save_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_save_"+indek).disabled=false;
  document.getElementById("frm_toolbar_save_"+indek).onclick=func;
}

toolbar.save.disabled=function(indek){
  document.getElementById("frm_toolbar_save_"+indek).disabled = true;
}

toolbar.save.none=function(indek){
  document.getElementById("frm_toolbar_save_"+indek).style.display="none";
}

toolbar.delet=function(indek,func){
  document.getElementById("frm_toolbar_delete_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_delete_"+indek).disabled=false;
  document.getElementById("frm_toolbar_delete_"+indek).onclick=func;
}

toolbar.delet.disabled=function(indek){
  document.getElementById("frm_toolbar_delete_"+indek).disabled=true;
}

toolbar.download=function(indek,func){
  document.getElementById("frm_toolbar_export_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_export_"+indek).disabled=false;
  document.getElementById("frm_toolbar_export_"+indek).onclick=func;
}

toolbar.upload=function(indek,func){
  document.getElementById("frm_toolbar_import_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_import_"+indek).disabled=false;
  document.getElementById("frm_toolbar_import_"+indek).onclick=func;
}

toolbar.edit=function(indek,func){
  document.getElementById("frm_toolbar_edit_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_edit_"+indek).disabled=false;
  document.getElementById("frm_toolbar_edit_"+indek).onclick=func;
}

toolbar.cancel=function(indek,func){
  document.getElementById("frm_toolbar_cancel_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_cancel_"+indek).onclick=func;
}

toolbar.preview=function(indek,func){
  document.getElementById("frm_toolbar_preview_"+indek).style.display="inline";
  document.getElementById("frm_toolbar_preview_"+indek).disabled=false;
  document.getElementById("frm_toolbar_preview_"+indek).onclick=func;
}
// eof 13;126;
