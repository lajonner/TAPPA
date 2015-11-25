var FOLDER_IMAGES="C:/Users/DALEMBERG/Desktop/lajonner/PICTOGRAMAS/";
var WIDTH_IMAGE=35;
var HEIGHT_IMAGE=35;

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
        tx.executeSql('SELECT id,name from PICTOGRAM_CATEGORY order by name asc', [], writeCategoryPictogramList);
    }
    
    function writeCategoryPictogramList(tx, results) {
        var ul = document.getElementById("categoryPictogramList");
       for (i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            var li = document.createElement("li");
            li.setAttribute("id", "li_"+row["id"])
            li.innerHTML='<a onclick="loadPictogramByCategoryId(dbObject,'+row["id"]+')" data-value="'+row["id"]+'" href="#" id="'+row["id"]+'">'+row['name']+'</a>';
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
                where+=" and p.name like '"+name+"%' ";
            }
        }
        dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name from pictogram p inner join pictogram_category pc on pc.id=p.category_id where p.id<>0 '+where+' order by pc.name,p.name asc LIMIT '+getLimitRecords()+'', [], writePictogramList);
        },dbObject.errorDataBase);  
    }

    function loadPictogramByName(dbObject,name,indexId){
        var where=" ";
        if (name!=null){
            if (name.trim().length>0){
                where+=" and p.name like '"+name+"%' ";
            }
        }
        dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name from pictogram p inner join pictogram_category pc on pc.id=p.category_id where p.id<>0 '+where+' order by pc.name,p.name asc LIMIT '+getLimitRecords()+'', [], function(tx,results){
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
            divContainer.setAttribute("style","float:left; width:10.0%;");
            divContainer.setAttribute("draggable","true");
            var innerHtmlBody='<img ondragstart="drag(event)" draggable="true"  title="'+row["name"]+'" src="'+FOLDER_IMAGES+'/'+(row["category_name"])+'/'+  (row['file'])+'" id="img_'+row['id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
            divContainer.innerHTML=innerHtmlBody;
            divPictograms.appendChild(divContainer);
            document.close();
        }  
    } 

     function loadImagePictogram(imageId) {
        var imageContainer = document.getElementById(imageId);
        var divContainer = document.createElement("div");
        divContainer.setAttribute("id", "result_"+imageId)
        divContainer.setAttribute("style","float:left; width:10.0%;");
        divContainer.setAttribute("draggable","true");
        var innerHtmlBody='<img  title="'+imageContainer.getAttribute("title")+'" src="'+imageContainer.getAttribute("src")+'" id="result_'+imageId+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
        innerHtmlBody+="<br/><label id='lbl_"+imageId+"' >"+imageContainer.getAttribute("title")+"</label>"
        divContainer.innerHTML=innerHtmlBody;
        return divContainer;
    }


          function copyPhrase(phraseId){
            var phraseLabel = document.getElementById(phraseId);
        var divContainer = document.createElement("div");
        divContainer.setAttribute("id", "result_phrase_"+phraseId)
        divContainer.setAttribute("style","float:left; width:10.0%;");
        divContainer.setAttribute("draggable","true");
        var innerHtmlBody='<b/><label id="label_'+phraseId+'"  ondragstart="drag(event)" draggable="true">'+phraseLabel.innerHTML+'</label></b>';
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
                where+=" and pp.code like '"+preferences+"%' or pp.name like '"+preferences+"%'";
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
            divContainer.setAttribute("style","float:left; width:100%;border:ridge;border-color: #ddd");
            var divLabel = document.createElement("div");         
            divLabel.setAttribute("style","float:left; width:10.0%;")
            divLabel.innerHTML="<button class='btn btn-default' type='button' id='btnSearch' onclick='copyPreference(dbObject,"+row["id"]+")'>"+row["code"]+"<i class='fa fa-search'></i></button><br/><br/><label>"+row["name"]+"</label>";
            divContainer.appendChild(divLabel);  
                
            tx.executeSql('SELECT ppl.id,ppl.phrase,p.id as pictogram_id,p.name as name,p.file as file,pc.name as category_name,ppl.preference_id from pictogram_preferences_line ppl left join pictogram p on p.id=ppl.pictogram_id left join pictogram_category pc on pc.id=p.category_id where ppl.preference_id='+preferenceId+' order by ppl.sequence asc', [],writePreferencesPictogramList 
        ,dbObject.errorDataBase);  
            document.close();
            divPictograms.appendChild(divContainer);
        }  
    } 

     function writePreferencesPictogramList(newTx,newResults){
                for (var i=0; i< newResults.rows.length; i++) {
                    var newRow=newResults.rows.item(i);
                var divContainer = document.getElementById("preference_"+newRow["preference_id"]);                  
                    if (newRow["pictogram_id"]!=null){
                        var divContainerImage = document.createElement("div");
                        divContainerImage.setAttribute("id", "pictogram_"+newRow["pictogram_id"])
                        divContainerImage.setAttribute("style","float:left; width:10.0%;");
                        divContainerImage.setAttribute("draggable","true");
                        var innerHtmlBody='<b>'+newRow["phrase"]+'</b>';
                        var innerHtmlBody='<img ondragstart="drag(event)" draggable="true"  title="'+newRow["name"]+'" src="'+FOLDER_IMAGES+'/'+(newRow["category_name"])+'/'+  (newRow['file'])+'" id="img_'+newRow['pictogram_id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
                        divContainerImage.innerHTML=innerHtmlBody;
                        divContainer.appendChild(divContainerImage);
                    }else{
 var divContainerPhrase = document.createElement("div");
            divContainerPhrase.setAttribute("id","phrase_"+newRow["id"]);
            divContainerPhrase.setAttribute("style","float:left; width:10.0%;");
            divContainerPhrase.setAttribute("draggable","true");
            var innerHtmlBodyPhrase='<b/><label id="label_phrase_'+indexId+'"  ondragstart="drag(event)" draggable="true">'+newRow["phrase"]+'</label></b>';
            divContainerPhrase.innerHTML=innerHtmlBodyPhrase;
            indexId=indexId+1;
            divContainer.appendChild(divContainerPhrase);

                    }
                    document.close();            
                }
            }

            function copyPreference(dbObject,id){            
            dbObject.db.transaction(function(tx) {
          

             tx.executeSql('SELECT ppl.id,ppl.phrase,p.id as pictogram_id,p.name as name,p.file as file,pc.name as category_name,ppl.preference_id from pictogram_preferences_line ppl left join pictogram p on p.id=ppl.pictogram_id left join pictogram_category pc on pc.id=p.category_id where ppl.preference_id='+id+' order by ppl.sequence asc', [],writePreferenceInResult 
        ,dbObject.errorDataBase);  

            });
        }
        

            function writePreferenceInResult(tx, newResults){
              for (var i=0; i< newResults.rows.length; i++) {
                    var newRow=newResults.rows.item(i);
                var divContainer = document.getElementById("pictogramResult");                  
                    if (newRow["pictogram_id"]!=null){
                        var divContainerImage = document.createElement("div");
                        divContainerImage.setAttribute("id", "pictogram_"+newRow["pictogram_id"])
                        divContainerImage.setAttribute("style","float:left; width:10.0%;");
                        divContainerImage.setAttribute("draggable","true");
                        var innerHtmlBody='<b>'+newRow["phrase"]+'</b>';
                        var innerHtmlBody='<img ondragstart="drag(event)" draggable="true"  title="'+newRow["name"]+'" src="'+FOLDER_IMAGES+'/'+(newRow["category_name"])+'/'+  (newRow['file'])+'" id="img_'+newRow['pictogram_id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
                        divContainerImage.innerHTML=innerHtmlBody;
                        divContainer.appendChild(divContainerImage);
                    }else{
 var divContainerPhrase = document.createElement("div");
            divContainerPhrase.setAttribute("id","phrase_"+newRow["id"]);
            divContainerPhrase.setAttribute("style","float:left; width:10.0%;");
            divContainerPhrase.setAttribute("draggable","true");
            var innerHtmlBodyPhrase='<b/><label id="label_phrase_'+indexId+'"  ondragstart="drag(event)" draggable="true">'+newRow["phrase"]+'</label></b>';
            divContainerPhrase.innerHTML=innerHtmlBodyPhrase;
            indexId=indexId+1;
            divContainer.appendChild(divContainerPhrase);

                    }
                    document.close();            
                }
        }  
            