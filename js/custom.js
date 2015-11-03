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

    $(".results table").tablesorter();

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
            if ($('#date_end').datepicker("getDate") && $('#date_beg').datepicker("getDate") > $(
                    '#date_end').datepicker("getDate")) {
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
            if ($('#date_beg').datepicker("getDate") && $('#date_beg').datepicker("getDate") > $(
                    '#date_end').datepicker("getDate")) {
                $('#date_beg').datepicker("setDate", selectedDate)
            }
            $("#dou").trigger('change');
        }
    });

    var params_template = {
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
            "document_date_b": "asc"
        },
        "fields": ["operation", "id", "document_type", "document_number",
            "document_date_b", "document_date_f", "document_name", "fond", "opis", "delo",
            "list", "date_from", "date_to", "authors", "geo_names", "image_path", "deal_type"
        ]
    };


    var get_dou = function() {
        $('.results table, .pagination').hide();
        $('#dou_table tbody').empty();

        $.ajax({
            url: "https://cdn.pamyat-naroda.ru/ind/pamyat/document/_search",
            type: "POST",
            data: JSON.stringify(params),
            contentType: 'text/plain',
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
                        trHTML +=
                            '<tr><td><a href="https://pamyat-naroda.ru/dou/?docID=' +
                            row._id + '" target="_blank">' + row._id + '</a></td><td>' +
                            (row.fields.fond && row.fields.fond[0]) + '</td><td>' +
                            (row.fields.opis && row.fields.opis[0]) + '</td><td>' +
                            (row.fields.delo && row.fields.delo[0]) + '</td><td>' +
                            (row.fields.list && row.fields.list[0]) + '</td><td>' +
                            (row.fields.document_name && row.fields.document_name[0]) +
                            '</td><td>' +
                            (row.fields.authors && row.fields.authors[0]) +
                            '</td><td class="nowrap">' +
                            (row.fields.document_date_b && row.fields.document_date_b[0]) +
                            '</td></tr>';
                    });
                    $('#dou_table tbody').append(trHTML);
                    $("#dou_table").trigger("update");
                    $('#dou_table').show();

                    if (data.hits.total > params.size) {
                        $('.pagination').css('display', 'block');
                    }
                }
            }
        });
    };


    var get_jbd = function() {
        $('.results table, .pagination').hide();
        $('#jbd_table tbody').empty();

        $.ajax({
            url: "https://cdn.pamyat-naroda.ru/ind/pamyat/magazine/_search",
            type: "POST",
            data: JSON.stringify(params),
            contentType: 'text/plain',
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
                        trHTML +=
                            '<tr><td><a href="https://pamyat-naroda.ru/jbd/' +
                            row._id + '" target="_blank">' + row._id + '</a></td><td>' +
                            (row.fields.fond && row.fields.fond[0]) + '</td><td>' +
                            (row.fields.opis && row.fields.opis[0]) + '</td><td>' +
                            (row.fields.delo && row.fields.delo[0]) + '</td><td>' +
                            (row.fields.list && row.fields.list[0]) + '</td><td>' +
                            (row.fields.document_name && row.fields.document_name[0]) +
                            '</td><td>' +
                            (row.fields.authors && row.fields.authors[0]) +
                            '</td><td class="nowrap">' +
                            (row.fields.date_from && row.fields.date_from[0]) +
                            '</td><td class="nowrap">' +
                            (row.fields.date_to && row.fields.date_to[0]) +
                            '</td></tr>';
                    });
                    $('#jbd_table tbody').append(trHTML);
                    $("#jbd_table").trigger("update");
                    $('#jbd_table').show();

                    if (data.hits.total > params.size) {
                        $('.pagination').css('display', 'block');
                    }
                }
            }
        });
    };


    var jbd, get_data;

    build_params();

    $("#dou").on('change', function() {
        build_params();
    });
    $('#dou').on('submit', function(event) {
        event.preventDefault();
        get_data();
    });


    function build_params() {
        params = JSON.parse(JSON.stringify(params_template));

        jbd = $('input[name=switch]:checked').val() == 'jbd' ? true : false

        get_data = jbd ? get_jbd : get_dou

        if (jbd) {
            if ($("#date_beg").val() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "date_to": {
                            "gte": $("#date_beg").val()
                        }
                    }
                });
            }
            if ($("#date_end").val() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "date_from": {
                            "lte": $("#date_end").val()
                        }
                    }
                });
            }
        } else {
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
            $("#checkboxes div input:checked").each(function(k, v) {
                params.query.filtered.query.bool.should.push({
                    "match_phrase": {
                        "document_type": v.value
                    }
                });
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

        var sort = $("#sort").val()
        if (sort) {
            var temp = {};
            if (jbd && sort == "document_date_b") {
                sort = "date_from"
            }
            temp[sort] = "asc";
            params.sort = temp;
        }

        $('#params').val(JSON.stringify(params));
    };


    if ($('#advanced_settings').prop("checked")) {
        $('#advanced').show();
    }
    $('#advanced_settings').on('change', function(event) {
        event.preventDefault();
        $('#advanced').toggle();
    });

    $('#params').on('change', function() {
        params = JSON.parse($('#params').val());
    });

    $(".next").on('click', function() {
        if (response.hits.total > (params.size + params.from)) {
            params.from += params.size;
            $('#params').val(JSON.stringify(params));
            get_data();
        }
    });

    $(".prev").on('click', function() {
        if (params.from > 0) {
            params.from -= params.size;
            $('#params').val(JSON.stringify(params));
            get_data();
        }
    });

    // Checkboxes

    $('.selectBox').click(function(e) {
        $('#checkboxes').toggle();
        $('.multiselect').toggleClass('active');
    });

    $(document).bind('click', function(e) {
        var clicked = $(e.target);
        if (!clicked.parents().hasClass("multiselect")) {
            $('#checkboxes').hide();
            $('.multiselect').removeClass('active');
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
    });

    //Popup
    var nick = 'venireman';
    var message = '<p>Если поиск перестанет работать, пишите на <a href="mailto:' + nick +
        '@yandex.ru?subject=Pamyat-naroda-search">' + nick + '@yandex.ru</a></p>'
    $('#info').append(message);

    $('#show-info').magnificPopup({
        items: {
            src: '#info',
            type: 'inline',
            midClick: true
        }
    });
});
