$(function() {
    $.extend($.tablesorter.defaults, {
        theme: 'blue',
        widthFixed: false,
        sortReset: true
    });
});

/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Andrew Stromnov (stromnov@gmail.com). */
// https://jquery-ui.googlecode.com/svn/tags/latest/ui/i18n/jquery.ui.datepicker-ru.js
jQuery(function($) {
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
});


// Main
$(document).ready(function() {

    $("#records_table").tablesorter();

    $("input[type=text], input[type=date]").addClear({
        right: 10,
        showOnLoad: true,
        onClear: build_params
    });

    $.datepicker.setDefaults($.datepicker.regional["ru"]);
    $.datepicker.setDefaults({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        showOtherMonths: true,
        selectOtherMonths: true,
        minDate: new Date(1935, 1 - 1, 26),
        maxDate: new Date(1955, 1 - 1, 26),
        defaultDate: new Date(1941, 6 - 1, 22)
    });
    $("#date_beg").datepicker({
        onSelect: function(selectedDate) {
            //             $("#date_end").datepicker("option", "minDate", selectedDate);
            //             $("#date_beg").datepicker("option", "maxDate", new Date(1955, 1 - 1, 26));
            $("#date_end").datepicker("option", "defaultDate", selectedDate);
            if ($('#date_end').datepicker("getDate") && $('#date_beg').datepicker("getDate") > $('#date_end').datepicker("getDate")) {
                $('#date_end').datepicker("setDate", selectedDate)
            }
            $("#dou").trigger('change');
        }
    });
    $("#date_end").datepicker({
        onSelect: function(selectedDate) {
            //             $("#date_beg").datepicker("option", "maxDate", selectedDate);
            //             $("#date_end").datepicker("option", "minDate", new Date(1935, 1 - 1, 26));
            $("#date_beg").datepicker("option", "defaultDate", selectedDate);
            if ($('#date_beg').datepicker("getDate") && $('#date_beg').datepicker("getDate") > $('#date_end').datepicker("getDate")) {
                $('#date_beg').datepicker("setDate", selectedDate)
            }
            $("#dou").trigger('change');
        }
    });

    params_template = {
        "query": {
            "filtered": {
                "query": {
                    "bool": {
                        "must": [],
                        "should": [],
                        "minimum_should_match": 1
                    }
                },
                "filter": {
                    "bool": {
                        "must": []
                    }
                }
            }
        },
        "size": 20,
        "from": 0,
        "sort": {
            "fond": "asc"
        }
    };

    build_params();

    $("#dou").on('change', function() {
        build_params();
    });
    $('#dou').on('submit', function(event) {
        event.preventDefault();
        get_dou();
    });

    function build_params() {
        params = JSON.parse(JSON.stringify(params_template));
        if ($("#date_beg").val() != '') {
            params.query.filtered.filter.bool.must.push({
                "range": {
                    "document_date_b": {
                        "gte": $("#date_beg").val()
                    }
                }
            });
        }
        if ($("#date_end").val() != '') {
            params.query.filtered.filter.bool.must.push({
                "range": {
                    "document_date_b": {
                        "lte": $("#date_end").val()
                    }
                }
            });
        }
        if ($("#fond").val() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "fond": $("#fond").val()
                }
            });
        }
        if ($("#opis").val() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "opis": $("#opis").val()
                }
            });
        }
        if ($("#delo").val() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "delo": $("#delo").val()
                }
            });
        }
        if ($("#doc_id").val() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "id": $("#doc_id").val()
                }
            });
        }
        if ($("#doc_name").val() != '') {
            params.query.filtered.query.bool.must.push({
                //                 "match_phrase": {
                //                     "document_name": {
                //                        "query":$("#doc_name").val(),
                //                        "slop":  1
                //                      }
                //                 }
                "match": {
                    "document_name": {
                        "query": $("#doc_name").val(),
                        "operator": "and"
                    }
                }
            });
        }
        if ($("#author").val() != '') {
            params.query.filtered.query.bool.must.push({
                "match_phrase": {
                    "authors": {
                        "query": $("#author").val(),
                        "slop": 1 // макс расстояние между словами
                    }
                }
                //                     "match": {
                //                         "authors": {
                //                             "query": $("#author").val(),
                //                             "operator": "and"
                //                         }
                //                     }
            });
        }
        if ($("#size").val() != '') {
            params.size = parseInt($("#size").val());
        }
        if ($("#sort").val() != '') {
            var temp = {};
            temp[$("#sort").val()] = "asc";
            params.sort = temp;
        }

        $("#checkboxes div input:checked").each(function(k, v) {
            params.query.filtered.query.bool.should.push({
                "match_phrase": {
                    "document_type": v.value
                }
            });
        });

        $('#params').val(JSON.stringify(params));
    };

    function get_dou() {
        $('#records_table, .pagination').hide();
        $('#records_table tbody').empty();
        $.ajax({
            url: "https://cdn.pamyat-naroda.ru/ind/pamyat/document/_search",
            type: "POST",
            data: JSON.stringify(params),
            dataType: 'json',
            error: function(data) {
                response = data;
                console.log('[*]Error:', data);
                $('#res').val(data.responseText);
                $('.message').html('<b>Ошибка загрузки!</b>');
            },
            success: function(data) {
                response = data;
                console.log('[*]Response:', data);
                $('#res').val(JSON.stringify(data));
                $('.message').html(
                    'Загружено <b>' + data.hits.hits.length +
                    '</b> результатов из <b>' + data.hits.total + '</b>'
                );
                if (data.hits.total > 0) {
                    var trHTML = '';
                    data.hits.hits.forEach(function(row) {
                        trHTML += '<tr><td><a href="https://pamyat-naroda.ru/dou/?docID=' +
                            row._id + '">' + row._id + '</a></td><td>' +
                            row._source.fond + '</td><td>' +
                            row._source.opis + '</td><td>' +
                            row._source.delo + '</td><td>' +
                            row._source.document_name + '</td><td>' +
                            row._source.authors + '</td><td class="nowrap">' +
                            row._source.document_date_b + '</td></tr>';
                    });
                    $('#records_table tbody').append(trHTML);
                    $("#records_table").trigger("update");
                    $('#records_table').show();

                    if (data.hits.total > params.size) {
                        $('.pagination').css('display', 'block');
                    }
                }
            }
        });
    };

    if ($('#advanced_settings').prop("checked")) {
        $('#advanced').show();
    }
    $('#advanced_settings').on('change', function() {
        $('#advanced').toggle();
    });

    $('#params').on('change', function() {
        params = JSON.parse($('#params').val());
    });

    $(".next").on('click', function() {
        if (response.hits.total > (params.size + params.from)) {
            params.from += params.size;
            $('#params').val(JSON.stringify(params));
            get_dou();
        }
    });

    $(".prev").on('click', function() {
        if (params.from > 0) {
            params.from -= params.size;
            $('#params').val(JSON.stringify(params));
            get_dou();
        }
    });

    // Checkboxes

    $('.selectBox').click(function(e) {
        $('#checkboxes').toggle();
    });

    $(document).bind('click', function(e) {
        clicked = $(e.target);
        if (!clicked.parents().hasClass("multiselect")) {
            $('#checkboxes').hide();
        }
    });

    $("#reset").on('change', function() {
        if (this.checked) {
            $('#checkboxes div input').prop('checked', false);
        }
    });

    $("#checkboxes div input").on('change', function() {
        if ($("#checkboxes div input[type=checkbox]:checked").length == 0) {
            $('#reset').prop('checked', true);
        } else {
            $('#reset').prop('checked', false);
        }
    })
});
