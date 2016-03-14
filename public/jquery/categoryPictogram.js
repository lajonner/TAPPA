
     function getLimitRecords(){
        var limitRecords = document.getElementById("limitRecords");
            if(limitRecords.value.length<=0){
                return "0";
            }
        return limitRecords.value;
    }

    function loadCategoryByName(dbObject,name){
        var where=" ";
        if (name!=null){
            if (name.trim().length>0){
                where+=" and c.name like '"+name+"%' ";
            }
        }
        dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT c.id as id,c.name as name,(SELECT COUNT(ID) FROM PICTOGRAM WHERE category_id=c.id) as counter from pictogram_category c where c.id<>0 '+where+' group by c.id,c.name order by c.name asc LIMIT '+getLimitRecords()+'', [], writeCategoryList);
        },dbObject.errorDataBase);        
    }

function writeCategoryList(tx, results){
        var divCategories = document.getElementById("categoryList");
        divCategories.innerHTML="";
        for (var i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            var divContainer = document.createElement("div");
            divContainer.setAttribute("id", "category_"+row["id"]);
            divContainer.setAttribute("class", "btn btn-default");            
            divContainer.setAttribute("style","float:left; width:33.33%;");
        divContainer.innerHTML="<br/><a href='#' class='btn btn-xs' onclick='deleteRecord("+row["id"]+")'><i class='fa fa-trash-o'></i></a><a href='#' onclick='editRecord("+row["id"]+")'>"+row["name"]+"</a><br/><a href='#' onclick='searchPictograms("+row["id"]+")'><b>"+row["counter"]+" Pictogramas</b></a>";            
            divCategories.appendChild(divContainer);
            document.close();
        }  
    }
  
  function loadCategoryPictogramForm(dbObject,id) {
        dbObject.db.transaction(function(tx) {
             tx.executeSql('SELECT id,name,folder,description from PICTOGRAM_CATEGORY where id=? order by name asc', [id,], writeCategoryPictogramForm);        
       });  
    }
    
    function writeCategoryPictogramForm(tx, results) {
        var fld_name = document.getElementById("fld_name");
        var fld_folder = document.getElementById("fld_folder");
        var fld_description = document.getElementById("fld_description");
        for (i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            fld_name.value=row["name"];
            fld_folder.value=row["folder"];
            fld_description.value=row["description"];
            document.close();
        }  
    }     
