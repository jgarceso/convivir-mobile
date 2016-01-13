var productoPage = {
    largoPagina: 20,
    inicializar: function () {
        var me = this;

        $('#btn-buscar').on('click', function () {
            me.realizarBusqueda(true, 1, true);
        });
        $("#form-buscar").submit(function (event) {
            event.preventDefault();
            $('#btn-buscar').focus();
            $('#btn-buscar').click();
        });

        $('#resultado-busqueda').on({
            popupbeforeposition: function () {
                var h = $(window).height();
                $("#resultado-busqueda").css("height", h);
                $("#resultado-busqueda").css("width", $(window).width());
            }

        });
    },
    realizarBusqueda: function (crearPaginacion, pagina, obtenerTotal) {
        var me = this;
        var textBusqueda = $("#autocomplete-input").val();
        $.mobile.loading("show", {text: "Cargando...", textVisible: true});
        $.ajax({
                            url: "http://jparcompany.com/convivir/api/Producto/buscar",
                            dataType: "json",
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa('userAdminConvivir' + ":" + 'a?{TO53i..'));
            },
            crossDomain: true,
            data: me.obtenerParametrosBusqueda(textBusqueda, pagina, obtenerTotal),
            success: function (resultado) {
                if (resultado.Datos.length === 0) {
                    $("#contenedor-busqueda").html('');
                    $.mobile.loading("hide");
                    alert('No se han encontrado productos según sus criterios de búsqueda.');
                    return;
                }
                if (crearPaginacion)
                    me.setearPaginacion(resultado.Total);
                me.mostrarResultadosBusqueda(resultado.Datos, pagina);
                $.mobile.loading("hide");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $.mobile.loading("hide");
                alert("Ha ocurrido un error. Intente nuevamente. "+thrownError);
            }
             });
    },
    mostrarResultadosBusqueda: function (data, pagina) {
        var me = this;
        var html = "";
        var contenedor = $("#contenedor-busqueda");

        html = '<ul id ="listado-busqueda" data-role="listview" data-inset="true">';

        for (var i = 0; i < data.length; i++) {
            html += "<li>"
            html += "<h2>" + me.obtenerEstadoProducto(data[i].IdEstadoCertificacion) + data[i].Producto + "</h2>";
            html += "<p><strong>" + data[i].Empresa + "</strong></p>";
            html += "<p>" + data[i].Categoria + "</p>";
            html += "<p>" + data[i].SubCategoria + "</p>";
            html += "</li>";
        }
        html += "</ul>";
        contenedor.html(html);
        me.actualizarMensajeBusqueda(pagina,data.length);
        $("#listado-busqueda").listview().trigger("create");
        $('#resultado-busqueda').popup("open");
    },
    setearPaginacion: function (totalFilas) {
        var me = this;
        me.totalFilas = totalFilas;
        var totalPaginas = parseInt(totalFilas / me.largoPagina);
        var resto = totalFilas / me.largoPagina;
        if (resto > 0)
            totalPaginas += 1;

        if (me.paginador === undefined) {
            me.paginador = $('#contenedor-paginador').bootpag({
                total: totalPaginas,
                page: 1,
                maxVisible: 5,
                leaps: true,
                firstLastUse: true,
                first: '←',
                last: '→',
                wrapClass: 'pagination',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first'
            });
            me.paginador.on("page", function (event, num) {
                me.realizarBusqueda(false, num, false);
            });
        }else{
             me.paginador.bootpag({total: totalPaginas, page:1}); 
        }
    },
    actualizarMensajeBusqueda: function(pagina, largoResultados){
        var me = this;
        var inicio, final;
       
       inicio = me.largoPagina * (pagina - 1) + 1;
       final = me.largoPagina * (pagina - 1)+largoResultados;
       
       $('#texto-resultados').html('Mostrando '+inicio+'-'+final+' de '+me.totalFilas +' productos.');     
    },
    obtenerEstadoProducto: function (idEstado) {
        var claseCss = "";
        switch (idEstado) {
            case "1":
                claseCss = "circulo-estado-verde";
                break;
            case "2":
                claseCss = "circulo-estado-amarillo";
                break;
            case "3":
                claseCss = "circulo-estado-rojo";
                break;
        }
        return "<div class='" + claseCss + "'></div>";
    },
    obtenerParametrosBusqueda: function (strBuscar, pagina, incluirTotal) {
        var me = this;
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
            inicio: me.largoPagina * (pagina - 1),
            largoPagina: me.largoPagina,
            incluirTotal: incluirTotal,
            strBusqueda: strBuscar
        };

        return opcionesBusqueda;
    }
};


$(document).on("pagecreate", "#buscador-productos", function () {
    productoPage.inicializar();
});

$(document).on("pageshow", function () {
    if($('#form-buscar')[0])
        $('#form-buscar')[0].reset();
    if($("#contenedor-busqueda"))
        $("#contenedor-busqueda").html('');
});
