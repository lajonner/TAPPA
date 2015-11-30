
var server = "http://localhost:81/SAC";
var controller = "";

//---------------------------------------------------------------------------------------------------------------------------
//Ajax SAC Controller
//---------------------------------------------------------------------------------------------------------------------------
function AjaxSAC(controllerAction, dataPost, loader, callback) {
    if (loader){$("#loader_sys").show();}
    $.ajax({
        url: server + controllerAction,
        type: "post",
        data: dataPost,
        success: function (data) {
            $("#loader_sys").hide();
            callback(data);
        }, error: function (jqXHR, ajaxOptions, thrownError) {
            $("#loader_sys").hide();
            //callback(formatErrorMessage(jqXHR, ajaxOptions));
            alerta(formatErrorMessage(jqXHR, ajaxOptions));
        }
    });
}


//---------------------------------------------------------------------------------------------------------------------------
//Respuestas de Error
//---------------------------------------------------------------------------------------------------------------------------
function formatErrorMessage(jqXHR, exception) {
    if (jqXHR.status === 0) { return ('Not connected.\nPlease verify your network connection.'); }
    else if (jqXHR.status == 404) { return ('The requested page not found. [404]'); }
    else if (jqXHR.status == 500) { return ('Internal Server Error [500].'); }
    else if (exception === 'parsererror') { return ('Requested JSON parse failed.'); }
    else if (exception === 'timeout') { return ('Time out error.'); }
    else if (exception === 'abort') { return ('Ajax request aborted.'); }
    else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eventos de Escritura onKeyPress
//---------------------------------------------------------------------------------------------------------------------------
function validaEvento(e) {
    var keynum;
    if (window.event)
        { keynum = e.keyCode; }
    else if (e.which)
        { keynum = e.which; }
    return keynum;
}


//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema
//---------------------------------------------------------------------------------------------------------------------------
function alerta(alert_mensaje) {
    $("#alert_sys").show();
    $("#alert_titulo").html("Sac Ventas");
    $("#alert_mensaje").html(alert_mensaje);
    setTimeout(function () {$("#alert_button").focus();}, 100);
}

//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema - Cerrar
//---------------------------------------------------------------------------------------------------------------------------
function alerta_cerrar() {
    $("#alert_sys").hide();
}

//---------------------------------------------------------------------------------------------------------------------------
//Ejecuciones con Timers de Pagina
//---------------------------------------------------------------------------------------------------------------------------
function AppTimers() {
    //Notificaciones Top
    //-------------------------------------------------------------
    AppGestorNotificacion();
    setInterval(function () { AppGestorNotificacion(); }, 600000); //10 minutos
}

//Notificaciones Top
function AppGestorNotificacion() {
    AjaxSAC("/Index/AppGestorNotificacion", '', false, function (callback) {
        $("#AppGestorNotificacion_Top").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Carga option en Contenedor
//---------------------------------------------------------------------------------------------------------------------------
function loadOption(option) {
    AjaxSAC(option, "", true, function (callback) {
        $("#contenedor").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Enter para buscador
//---------------------------------------------------------------------------------------------------------------------------
function searchEnter(evento) {
    var key = validaEvento(evento);
    if (key == 13) { searchList(); } else { return true; }
}


//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchList() {
        var dataPost = {
            txt_search: $("#txt_search").val(),
            var_PaginaActual: 1,
        };
        AjaxSAC(controller, dataPost, true, function (callback) {
            $("#AppList").html(callback);
        });
    }

//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagDerecha() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) + 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Izquierda
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagIzquierda() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) - 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppNuevo() {
    var dataPost = {
        txt_id: ''
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppEdit(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Cerrar Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function edit_cerrar() {
    $("#AppContent_Edit").html("");
    $("#AppContent_List").show();
    $("#AppContent_Edit").hide();
    searchList();
}

//---------------------------------------------------------------------------------------------------------------------------
//Delete Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppDelete(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Delete', dataPost, true, function (callback) {
        alerta(callback);
        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Marcado de Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppMarcarChecks() {
    var checks="";
    
    if($("#hdn_checks").val()=="0")
    {
        $("input:checkbox").each(function () {
            try{
            $("#"+$(this).attr('id')).prop('checked',true);
            }catch(e){}
        });
        $("#hdn_checks").val("1");
    }
    else
    {
        $("input:checkbox").each(function () {
            $("#"+$(this).attr('id')).prop('checked',false);
        });
        $("#hdn_checks").val("0");
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eliminado de Registros marcados por Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppEliminar() {
    var checks="";
    $("input:checkbox:checked").each(function () {
        checks=checks+($(this).attr('id'))+'|';
    });

    if(checks=='')
    {
        alerta("Por favor seleccionar un elemento");
        return false;
    }
    else
    {
        var dataPost = {
            txt_cadena: checks
        };
        AjaxSAC(controller+'DeleteChecks', dataPost, true, function (callback) {
            alerta(callback);
            searchList();
        });
    }
}
