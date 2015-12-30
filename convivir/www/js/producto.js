var productoPage = {
    inicializar: function () {
        var me = this;
        $("#autocomplete").on("filterablebeforefilter", function (e, data) {
                    var $ul = $(this),
                                $input = $(data.input),
                                value = $input.val(),
                                html = "";
                    $ul.html("");
                    if (value && value.length > 2) {
                            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                            $ul.listview("refresh");
                            $.ajax({
                                    url: "http://localhost:8080/convivir/api/Producto/buscar",
                                    dataType: "json",
                    type: 'POST',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', "Basic " + btoa('userAdminConvivir' + ":" + 'a?{TO53i..'));
                    },
                                    crossDomain: true,
//                xhrFields: { withCredentials: true },
                    data: me.obtenerParametrosBusqueda(value),
                    success: function (resultado) {
                        var hhh = "";
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var bna = "";
                        alert(thrownError);
                    }
                            });

//            .then( function ( response ) {
//                $.each( response, function ( i, val ) {
//                    html += "<li>" + val + "</li>";
//                });
//                $ul.html( html );
//                $ul.listview( "refresh" );
//                $ul.trigger( "updatelayout");
//            });
                    }
            });
    },
    //ESTO FUNCIONA
    inicializar1: function () {
        jQuery.support.cors = true;
        var me = this;
        $("#autocomplete").on("filterablebeforefilter", function (e, data) {
                    var $ul = $(this),
                                $input = $(data.input),
                                value = $input.val(),
                                html = "";
                    $ul.html("");
                    if (value && value.length > 2) {
                            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
                            $ul.listview("refresh");
                            $.ajax({
                                    url: "http://localhost:8080/convivir/api/Producto",
                                    dataType: "json",
                    type: 'GET',
//                username: 'userAdminConvivir',
//                password: 'a?{TO53i..',
//                beforeSend: function (xhr){ 
//                xhr.setRequestHeader('Authorization', "Basic " + btoa('userAdminConvivir' + ":" + 'a?{TO53i..')); 
//                },
                                    crossDomain: true,
//                xhrFields: { withCredentials: true },
                                    //data: me.obtenerParametrosBusqueda(value),
                    success: function (resultado) {
                        var hhh = "";
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var bna = "";
                        alert(thrownError);
                    }
                            });

//            .then( function ( response ) {
//                $.each( response, function ( i, val ) {
//                    html += "<li>" + val + "</li>";
//                });
//                $ul.html( html );
//                $ul.listview( "refresh" );
//                $ul.trigger( "updatelayout");
//            });
                    }
            });
    },
    obtenerParametrosBusqueda: function (strBuscar) {
        var checkAlimentos = $('#checkbox-alimentos')[0];
        var checkMedicamentos = $('#checkbox-medicamentos')[0];
        var tipos = "";

        if ((checkAlimentos.checked && checkMedicamentos.checked) || (!checkAlimentos.checked && !checkMedicamentos.checked)) {
            tipos = checkAlimentos.value + ',' + checkMedicamentos.value;
        }
        else {
            tipos = checkAlimentos.checked ? checkAlimentos.value : checkMedicamentos.value;
        }

        var opcionesBusqueda = {
            opciones: {
                tipo: tipos,
                producto: $('#checkbox-producto')[0].checked,
                categoria: $('#checkbox-categoria')[0].checked,
                subcategoria: false,
                empresa: $('#checkbox-empresa')[0].checked
            },
            limite: 20,
            strBusqueda: strBuscar
        };

        return opcionesBusqueda;
    }
};


$(document).on("pagecreate", function () {
    productoPage.inicializar();
});