var productoPage = {
    inicializar: function () {
        var me = this;

        $('#btn-buscar').on('click', function () {
            var textBusqueda = $("#autocomplete-input").val();

            $.ajax({
                                url: "http://jparcompany.com/convivir/api/Producto/buscar",
                                dataType: "json",
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', "Basic " + btoa('userAdminConvivir' + ":" + 'a?{TO53i..'));
                },
                                crossDomain: true,
                data: me.obtenerParametrosBusqueda(textBusqueda),
                success: function (resultado) {
                    me.mostrarResultadosBusqueda(resultado);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    var bna = "";
                    alert(thrownError);
                }
                        });
        });

//        $("#autocomplete").on("filterablebeforefilter", function (e, data) {
//                    var $ul = $(this),
//                                $input = $(data.input),
//                                value = $input.val(),
//                                html = "";
//                    $ul.html("");
//                    if (value && value.length > 2) {
//                            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
//                            $ul.listview("refresh");
//                            $.ajax({
//                                    url: "http://localhost:8080/convivir/api/Producto/buscar",
//                                    dataType: "json",
//                    type: 'POST',
//                    beforeSend: function (xhr) {
//                        xhr.setRequestHeader('Authorization', "Basic " + btoa('userAdminConvivir' + ":" + 'a?{TO53i..'));
//                    },
//                                    crossDomain: true,
//                    data: me.obtenerParametrosBusqueda(value),
//                    success: function (resultado) {
//                        me.mostrarResultadosBusqueda($ul, resultado);
//                    },
//                    error: function (xhr, ajaxOptions, thrownError) {
//                        var bna = "";
//                        alert(thrownError);
//                    }
//                            });
//                me.mostrarResultadosBusqueda($ul, null);
//                    }
//            });
    },
    mostrarResultadosBusqueda: function (data) {
        var html = "";
        var contenedor = $("#contenedor-busqueda");
        //$('#autocomplete').empty();
        if (data.length < 0) {
            contenedor.html('');
            return;
        }
        html = '<ul id ="listado-busqueda" data-role="listview" data-inset="true">';
        html += "<li data-role='list-divider'>Productos encontrados: (" + data.length + ")</li>";
        for (var i = 0; i < data.length; i++) {
            //html += "<li>" + data[i].Producto + "</li>";
            html+="<li>"
            html+="<h2><div class='circulo-estado-verde'></div>"+ data[i].Producto +"</h2>";
            html+="<p><strong>"+ data[i].Empresa +"</strong></p>";
            html+="<p>"+ data[i].Categoria +"</p>";
            html+="<p>"+ data[i].SubCategoria +"</p>";
            //html+= "<p class='ui-li-aside'><div class='circulo-estado-verde'></div></p>";
            //html+= "<p class='ui-li-aside'>nada</p>";
            html+="</li>";
        }
        html += "</ul>";
        contenedor.html(html);
        $("#listado-busqueda").listview().trigger("create");
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
                subcategoria: $('#checkbox-categoria')[0].checked,
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

$(document).on("pageshow", function () {
    $('#form-buscar')[0].reset();
});