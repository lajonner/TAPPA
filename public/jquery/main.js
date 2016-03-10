var SIZE_PHRASE="25.00";
    /**obtener limite de registros a obtener**/

     function getLimitRecords(){
        var limitRecords = document.getElementById("limitRecords");
        return limitRecords.value;
    }

    /****cargar categorias en elemento ul de ventana principal*****/

    function loadCategoryPictogramList(dbObject) {
        dbObject.executeSql(getCategoryPictogramList, dbObject.errorDataBase);
    }

    function getCategoryPictogramList(tx){
        tx.executeSql('SELECT id,name,folder from PICTOGRAM_CATEGORY order by name asc', [], writeCategoryPictogramList);
    }
    
    function writeCategoryPictogramList(tx, results) {
        var ul = document.getElementById("categoryPictogramList");
        var spanPictogram = document.getElementById("counterPictogramList");
        spanPictogram.innerHTML=""+results.rows.length;            
        for (i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            var li = document.createElement("li");
            li.setAttribute("id", "li_"+row["id"])
            li.innerHTML='<a onclick="loadPictogramByCategoryId(dbObject,'+row["id"]+')" data-value="'+row["id"]+'" href="#" id="'+row["id"]+'"><i class="fa fa-circle-o"></i>'+row['name']+'</a>';
            ul.appendChild(li);
            document.close();
        }  
    }     

    /****LISTA DE PICTOGRAMAS POR CATEGORIA O NOMBRE*****/
      
     function loadPictogramByCategoryId(dbObject,id){
        var name = document.getElementById("txtSearch").value;
        document.categoryId=id;
        var where=" ";
        if (id>0){
            where=" and pc.id="+id+" ";
        }        
        if (name!=null){
            if (name.trim().length>0){
                where+=" and (p.name like '"+name+"%' or p.name like '%"+name+"%') ";
            }
        }
         dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name,pc.folder as folder from pictogram p inner join pictogram_category pc on pc.id=p.category_id where p.id<>0 '+where+' order by pc.name,p.name asc LIMIT '+getLimitRecords()+'', [], writePictogramList);
        },dbObject.errorDataBase);  
    }

    function loadPictogramByName(dbObject,name,indexId){
        var where=" ";
        if (name!=null){
            if (name.trim().length>0){
                where+=" and p.name like '"+name+"%' or p.name like '%"+name+"%' ";
            }
        }
        dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name,pc.folder as folder from pictogram p inner join pictogram_category pc on pc.id=p.category_id where p.id<>0 '+where+' order by pc.name,p.name asc LIMIT '+getLimitRecords()+'', [], function(tx,results){
writePictogramList(tx,results);
            });
        },dbObject.errorDataBase);       
    }

    function writePictogramList(tx, results){
        var divPictograms = document.getElementById("pictogramList");
        divPictograms.innerHTML="";
        for (var i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            var divContainer = document.createElement("div");
            divContainer.setAttribute("id", "pictogram_"+row["id"])
            divContainer.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
            divContainer.setAttribute("draggable","true");
            //ondragstart="drag(event)" draggable="true" 
            var innerHtmlBody='<img  onclick="copyPictogram('+row['id']+',1)" title="'+row["name"]+'" src="'+getPictogramPath(row)+'" id="img_'+row['id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
            divContainer.innerHTML=innerHtmlBody;
            divPictograms.appendChild(divContainer);
            document.close();
        }  
    } 
	
	function getPictogramPath(row){
		var categoryFolder="";
		if(row["folder"]!=null){
			if (row["folder"].trim().length>0){
				categoryFolder=(row["folder"])+'/';
			}
		}  
		return FOLDER_IMAGES+'/'+categoryFolder+row['file'];
	} 
	
     function loadImagePictogram(imageId) {
        var imageContainer = document.getElementById(imageId);
        var divContainer = document.createElement("div");
        var DIV_ID="result_"+imageId
        divContainer.setAttribute("id", DIV_ID);
        divContainer.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
        divContainer.setAttribute("draggable","true");
        var innerHtmlBody='<img  class="img-responsive pad" title="'+imageContainer.getAttribute("title")+'" src="'+imageContainer.getAttribute("src")+'" id="result_'+imageId+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
        innerHtmlBody+='<br/><a href="#" class="btn btn-xs" onclick="dropDivById('+"'"+DIV_ID+"'"+')"><i class="fa fa-trash-o"></i></a>';
        innerHtmlBody+="<label id='lbl_"+imageId+"' >"+imageContainer.getAttribute("title")+"</label>"
        divContainer.innerHTML=innerHtmlBody;
        return divContainer;
    }


          function copyPhrase(phraseId){
            var phraseLabel = document.getElementById(phraseId);
            var phraseParts=phraseId.split("label_");
            var newPhraseId=phraseParts[1];
        var divContainer = document.createElement("div");
        divContainer.setAttribute("id", ""+newPhraseId+"cp")
        divContainer.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
        divContainer.setAttribute("draggable","true");
        var innerHtmlBody='<b/><a href="#" class="btn btn-xs" onclick="dropDivById('+"'"+newPhraseId+"cp'"+')"><i class="fa fa-trash-o"></i></a>';
        innerHtmlBody+='<label id="label_'+newPhraseId+'cp"  ondragstart="drag(event)" draggable="true">'+phraseLabel.innerHTML+'</label></b>';
        divContainer.innerHTML=innerHtmlBody;
        return divContainer;
          }

    function savePreferencesRecord(dbObject,l,code,name){     
        dbObject.executeSql(function(tx){
                     tx.executeSql('insert into PICTOGRAM_PREFERENCES(code,name)values(?,?)', [code,name],function(tx, results){
                        for (i=0; i< l.length; i++) {
                            tx.executeSql('insert into PICTOGRAM_PREFERENCES_LINE(pictogram_id,preference_id,phrase,sequence)values(?,?,?,?)', [l[i][0],results.insertId,l[i][1],l[i][2]]);
                        }
                        alert("Preferencia grabada con éxito");
        });
        }, dbObject.errorDataBase);
    }

    function loadPreferences(dbObject,preferences){
        var where=" ";
        if (preferences!=null){
            if (preferences.trim().length>0){
                where+=" and pp.code like '"+preferences+"%' or pp.name like '"+preferences+"%' or pp.name like '%"+preferences+"%'";
            }
        }
            dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT pp.id,pp.name,pp.code from pictogram_preferences pp where pp.id<>0 '+where+' order by pp.code,pp.name asc', [], function(tx,results){
      writePreferencesList(dbObject,tx, results);
            });
        },dbObject.errorDataBase);  
    }
   

    function writePreferencesList(dbObject,tx, results){
        var divPictograms = document.getElementById("pictogramList");
        divPictograms.innerHTML="";     
        for (var i=0; i< results.rows.length; i++) {
            var row=results.rows.item(i);           
            var preferenceId=row["id"]; 
            var divContainer = document.createElement("div");
            divContainer.setAttribute("id", "preference_"+row["id"])           
            divContainer.setAttribute("style","float:left; width:100%");
            var divLabel = document.createElement("div");         
            divLabel.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;")
            divLabel.innerHTML="<a href='#' class='btn btn-xs' onclick='deletePreference("+row["id"]+")'><i class='fa fa-trash-o'></i></a><a href='#' onclick='copyPreference(dbObject,"+row["id"]+")'>"+row["code"]+"</a><br/><label>"+row["name"]+"</label>";
            divContainer.appendChild(divLabel);                 
            tx.executeSql('SELECT ppl.id,ppl.phrase,p.id as pictogram_id,p.name as name,p.file as file,pc.name as category_name,pc.folder as folder,ppl.preference_id from pictogram_preferences_line ppl left join pictogram p on p.id=ppl.pictogram_id left join pictogram_category pc on pc.id=p.category_id where ppl.preference_id='+preferenceId+' order by ppl.sequence asc', [],writePreferencesPictogramList 
        ,dbObject.errorDataBase);  
            document.close();
            divPictograms.appendChild(divContainer);
        }  
    } 

     function writePreferencesPictogramList(newTx,newResults){
        var flag=1;
                for (var i=0; i< newResults.rows.length; i++) {
                    var newRow=newResults.rows.item(i);
                var divContainer = document.getElementById("preference_"+newRow["preference_id"]);                  
                    if (newRow["pictogram_id"]!=null){
                        var divContainerImage = document.createElement("div");
                        divContainerImage.setAttribute("id", "pictogram_"+newRow["pictogram_id"])
                        divContainerImage.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
                        divContainerImage.setAttribute("draggable","true");
                        var innerHtmlBody='<b>'+newRow["phrase"]+'</b>';
                        var innerHtmlBody='<img onclick="copyPictogram('+newRow['pictogram_id']+',1)"  title="'+newRow["name"]+'" src="'+getPictogramPath(newRow)+'" id="img_'+newRow['pictogram_id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
                        divContainerImage.innerHTML=innerHtmlBody;
                        divContainer.appendChild(divContainerImage);
                    }else{
                         var divContainerPhrase = document.createElement("div");
                        divContainerPhrase.setAttribute("id","phrase_"+newRow["id"]+"x"+flag);
                        divContainerPhrase.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
                        divContainerPhrase.setAttribute("draggable","true");
                        var innerHtmlBodyPhrase='<b/><label id="label_phrase_'+newRow["id"]+'x'+flag+'"  onclick="copyPictogram('+"'"+'label_phrase_'+newRow["id"]+'x'+flag+''+"'"+',2)">'+newRow["phrase"]+'</label></b>';
                        divContainerPhrase.innerHTML=innerHtmlBodyPhrase;
                        indexId=indexId+1;
                        divContainer.appendChild(divContainerPhrase);
                    }
                    document.close();
                    flag=flag+1;            
                }
            }

            function copyPreference(dbObject,id){            
            dbObject.db.transaction(function(tx) {
        tx.executeSql('SELECT ppl.id,ppl.phrase,p.id as pictogram_id,p.name as name,p.file as file,pc.name as category_name,pc.folder as folder,ppl.preference_id from pictogram_preferences_line ppl left join pictogram p on p.id=ppl.pictogram_id left join pictogram_category pc on pc.id=p.category_id where ppl.preference_id='+id+' order by ppl.sequence asc', [],writePreferenceInResult 
        ,dbObject.errorDataBase);  
            });
        }
        

            function writePreferenceInResult(tx, newResults){
                var flag=1;
              for (var i=0; i< newResults.rows.length; i++) {
                    var newRow=newResults.rows.item(i);
                var divContainer = document.getElementById("pictogramResult");  
                 var DIV_ID=null;                
                    if (newRow["pictogram_id"]!=null){
                        var divContainerImage = document.createElement("div");
                        DIV_ID="result_img_"+newRow["pictogram_id"];
                        divContainerImage.setAttribute("id", DIV_ID);
                        divContainerImage.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
                        divContainerImage.setAttribute("draggable","true");
                        var innerHtmlBody='<b>'+newRow["phrase"]+'</b>';
                        var innerHtmlBody='<img ondragstart="drag(event)" draggable="true"  title="'+newRow["name"]+'" src="'+getPictogramPath(newRow)+'" id="img_'+newRow['pictogram_id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
                        innerHtmlBody+='<br/><a href="#" class="btn btn-xs" onclick="dropDivById('+"'"+DIV_ID+"'"+')"><i class="fa fa-trash-o"></i></a>';
                        innerHtmlBody+='<label id="lbl_img_'+newRow["pictogram_id"]+'" >'+newRow["phrase"]+'</label></b>';
                        divContainerImage.innerHTML=innerHtmlBody;
                        divContainer.appendChild(divContainerImage);
                    }else{
 var divContainerPhrase = document.createElement("div");
 DIV_ID="phrase_"+newRow["id"]+"y"+flag;
            divContainerPhrase.setAttribute("id",DIV_ID);
            divContainerPhrase.setAttribute("style","float:left; width:"+SIZE_PHRASE+"%;");
            divContainerPhrase.setAttribute("draggable","true");
            var innerHtmlBodyPhrase='<br/><a href="#" class="btn btn-xs" onclick="dropDivById('+"'"+DIV_ID+"'"+')"><i class="fa fa-trash-o"></i></a>';
            innerHtmlBodyPhrase+='<label id="label_phrase_'+newRow["id"]+'y'+flag+'"  ondragstart="drag(event)" draggable="true">'+newRow["phrase"]+'</label></b>';
            divContainerPhrase.innerHTML=innerHtmlBodyPhrase;
            indexId=indexId+1;
            divContainer.appendChild(divContainerPhrase);

                    }
                    document.close();            
                    flag=flag+1;
                }
                
                
                
                
        }  
        
        function loadParameters(dbObject){
        dbObject.db.transaction(function(tx) {
            tx.executeSql("SELECT code_parameter,value_parameter from SYSTEM_PARAMETERS WHERE code_parameter='PATH_FILE'", [], function(tx,results){
writeParameters(tx,results);
            });
        },dbObject.errorDataBase);       
    }

    function writeParameters(tx, results){
        var fldParameter = document.getElementById("fldParameterPath");
        for (var i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            if (row["code_parameter"]=="PATH_FILE"){
            fldParameter.value=row["value_parameter"];
            }
            document.close();
        }  
    } 

    function saveParameter(dbObject,code,value){
        dbObject.db.transaction(function(tx) {
            tx.executeSql("UPDATE SYSTEM_PARAMETERS set value_parameter=? WHERE code_parameter=?", [value,code]);
        },dbObject.errorDataBase);       
    }

     function unlinkPreferences(dbObject,preferenceId){
            dbObject.db.transaction(function(tx) {
            tx.executeSql("delete from PICTOGRAM_PREFERENCES_LINE WHERE preference_id=?", [preferenceId]);
            tx.executeSql("delete from PICTOGRAM_PREFERENCES WHERE id=?", [preferenceId]);
        },dbObject.errorDataBase);

          }

    String.prototype.startsWith = function(str) {
        return ( str === this.substr( 0, str.length ) );
    }
