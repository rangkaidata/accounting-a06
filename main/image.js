/*
 * name: budiono
 * date: sep-04, 14:07, mon-2023; new;56;
 */
  
'use strict';


function loadFile(event,nomer){
  const output = document.getElementById('folder_image_'+nomer);
  output.src = URL.createObjectURL(event.target.files[0]);
  document.getElementById('name_image_'+nomer).value=event.target.files[0].name;
}

function noImage(nomer){
  document.getElementById('folder_image_'+nomer).src=bingkai[0].server.image+"/uploads/no_image.jpg";
  document.getElementById('name_image_'+nomer).value="no_image.jpg";
  document.getElementById('fileToUpload_'+nomer).value="";
}

function uploadImageChange(data,nomer){
  if(data.data==null) return;
  
  if(data.err.id !=0) return;
  
  if (document.getElementById("fileToUpload_"+nomer).value!=""){
    var blok_image = data.data.blok;
    var photo = document.getElementById("fileToUpload_"+nomer).files[0];
    var req = new XMLHttpRequest();
    var formData = new FormData();
    
    //alert(blok_image.substr(0,12));

    formData.append("fileToUpload", photo);
    formData.append("blok", data.data.blok);
    
    req.open("POST", bingkai[0].server.image+"upload.php");
    req.send(formData);

    req.onreadystatechange = function() {
      //var 
      if (this.readyState == 4){
        var bola=JSON.parse(req.responseText);
        if (bola.blok==blok_image){
          // alert('sukses upload image');
        }
        else{
          //msg.innerHTML=bola.blok;
          //alert('fail upload image ['+bola.blok+']');
          // msgBox.show("",0,1,bola.blok);
        }
      }
      else{
        //msg.innerHTML=bola.blok;
      }
    };
  }
}
