var FOLDER_IMAGES="../PICTOGRAMAS";
var HEIGHT_IMAGE=35;

    function getLimitRecords(){
        var limitRecords = document.getElementById("limitRecords");
        return limitRecords.value;
    }

     function loadPictogramByName(dbObject,categoryId,name){
        var where=" ";
        if (categoryId>0){
            where=" and pc.id="+categoryId+" ";
        }        
        if (name!=null){
            if (name.trim().length>0){
                where+=" and p.name like '"+name+"%' ";
            }
        }
        dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name from pictogram p inner join pictogram_category pc on pc.id=p.category_id where pc.id>0 '+where+' order by pc.name,p.name asc LIMIT '+getLimitRecords()+'', [], writePictogramList);
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
             divContainer.setAttribute("class", "btn btn-default");            
            var innerHtmlBody='<input type="checkbox" id="pict_check_'+row["id"]+'" /><a href="#" onclick="editRecord('+row["id"]+')">'+row["name"]+'</a><br/><img title="'+row["name"]+'" src="'+FOLDER_IMAGES+'/'+row["category_name"]+'/'+row['file']+'" id="img_'+row['id']+'" width="'+WIDTH_IMAGE+'" height="'+HEIGHT_IMAGE+'"/>'
            divContainer.innerHTML=innerHtmlBody;
            divPictograms.appendChild(divContainer);
            document.close();
        }  
    }   


    function loadPictogramForm(dbObject,id) {
        dbObject.db.transaction(function(tx) {
             tx.executeSql('SELECT p.id as id,p.name as name,p.file as file,pc.name as category_name,pc.id from pictogram p inner join pictogram_category pc on pc.id=p.category_id where p.id=? order by pc.name,p.name asc', [id,], writePictogramForm);        
       },dbObject.errorDataBase);  
    }
    
    function writePictogramForm(tx, results) {
        var fld_name = document.getElementById("fld_name");
        var fld_categ = document.getElementById("fld_category_id");
        var fld_file = document.getElementById("fld_file");
        var fld_img_file = document.getElementById("fld_img_file");
        for (i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            fld_name.value=row["name"];
            fld_categ.value=row["category_name"];
            $(".option_"+row["category_id"]+" select").val(row["category_name"]);
            fld_file.name=row["file"];
            result_img_file.setAttribute("src",FOLDER_IMAGES+"/"+row["category_name"]+"/"+row['file']+"");
            result_img_file.setAttribute("title",row["name"]);
            document.close();
        }}

        
    function loadPictogramCategoryList(dbObject) {
         dbObject.db.transaction(function(tx) {
            tx.executeSql('SELECT id,name from PICTOGRAM_CATEGORY order by name asc', [], writePictogramCategoryList);
        },dbObject.errorDataBase); 
    }
    
    function writePictogramCategoryList(tx, results) {
        var select = document.getElementById("fld_category_id");
       for (i=0; i< results.rows.length; i++) {
            row=results.rows.item(i);
            var option = document.createElement("option");
            option.setAttribute("id", "option_"+row["id"])
            option.innerHTML='<a data-value="'+row["id"]+'" id="'+row["id"]+'">'+row['name']+'</a>';
            select.appendChild(option);
            document.close();
        }
    } 