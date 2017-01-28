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

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    //console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
        alert('Копирование не поддерживается вашим браузером');
    }

    document.body.removeChild(textArea);
}


// Main
$(document).ready(function() {
    $.extend($.tablesorter.defaults, {
        theme: 'blue',
        widthFixed: false,
        sortReset: true
    });
    $(".results table").tablesorter();

    $("input[type=text], input[type=date]").addClear({
        right: 10,
        showOnLoad: true,
        tabbable: false,
        returnFocus: false
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
        // "sort": {
        //     "document_date_b": "asc"
        // },
        "fields": ["operation", "id", "document_type", "document_number",
            "document_date_b", "document_date_f", "document_name", "fond", "opis", "delo",
            "list", "date_from", "date_to", "authors", "geo_names", "image_path", "deal_type"
        ]
    };
    
    var customAPI, url;
    var API = 'http://cdn.pamyat-naroda.ru/ind/';
    // var API = 'https://cdn.pamyatnaroda.mil.ru/ind/';
    // var API = 'https://python-flask-test-1153.appspot.com/';
    var imagesCDN = 'http://cdn.pamyat-naroda.ru/imageload/';

    $('#apiURL').val('');
    $('#apiURL').on('change', function() {
        customAPI = $('#apiURL').val();
    });
    jQuery.fn.get_data = function() {
        var tableID, link;
        if (jbd) {
            url = customAPI || API + 'pamyat/magazine/_search';
            tableID = "#jbd_table";
        }
        else {
            url = customAPI || API + 'pamyat/document,map/_search';
            tableID = "#dou_table";
        }
        $('.results table, .pagination').hide();
        $('tbody', tableID).empty();
        $.ajax({
            url: url,
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
                        link = '<a href="' + 'https://pamyat-naroda.ru/documents/view/?id=' +
                            row._id + '" target="_blank">' + row._id + '</a>';
                        trHTML +=
                            '<tr><td>' + link + '</td><td><span class="path">' +
                            '<img style="height: 16px;" src="images/copy.png" title="' +
                            (row.fields.image_path ? imagesCDN + row.fields.image_path[0] : '') +
                            '"></span></td><td class="nowrap">' +
                            (row.fields.fond ? row.fields.fond[0] : '') + '</td><td class="nowrap">' +
                            (row.fields.opis ? row.fields.opis[0] : '') + '</td><td class="nowrap">' +
                            (row.fields.delo ? row.fields.delo[0] : '') + '</td><td class="nowrap">' +
                            (row.fields.list ? row.fields.list[0] : '') + '</td><td>' +
                            (row.fields.document_name && row.fields.document_name[0]) +
                            '</td><td>' +
                            (row.fields.authors && row.fields.authors[0]) + '</td>';
                        if (jbd) {
                            trHTML += '<td class="nowrap">' + (row.fields.date_from &&
                                    row.fields.date_from[0]) +
                                '</td><td class="nowrap">' + (row.fields.date_to &&
                                    row.fields.date_to[0]) + '</td>';
                        }
                        else {
                            trHTML += '<td class="nowrap">' +
                                (row.fields.document_date_b && row.fields.document_date_b[0]) + '</td>';
                        }
                        trHTML += '</tr>';
                    });
                    $('tbody', tableID).append(trHTML);
                    $(tableID).trigger("update");
                    $(tableID).show();
                    if (data.hits.total > params.size) {
                        $('.pagination').css('display', 'block');
                    }
                }
            }
        });
    };
    var jbd = false;
    var params;
    build_params();
    $("#dou, input[name=switch]").on('change', function() {
        build_params();
    });
    $('#dou, #advanced').on('submit', function(event) {
        event.preventDefault();
        $.fn.get_data();
    });

    function build_params() {
        params = JSON.parse(JSON.stringify(params_template));
        jbd = $('input[name=switch]:checked').val() == 'jbd' ? true : false;
        if (jbd) {
            if ($("#date_beg").val().trim() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "date_to": {
                            "gte": $("#date_beg").val().trim()
                        }
                    }
                });
            }
            if ($("#date_end").val().trim() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "date_from": {
                            "lte": $("#date_end").val().trim()
                        }
                    }
                });
            }
        }
        else {
            if ($("#date_beg").val().trim() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "document_date_b": {
                            "gte": $("#date_beg").val().trim()
                        }
                    }
                });
            }
            if ($("#date_end").val().trim() != '') {
                params.query.filtered.filter.bool.must.push({
                    "range": {
                        "document_date_b": {
                            "lte": $("#date_end").val().trim()
                        }
                    }
                });
            }
            $("#checkboxes div input:checked").each(function(k, v) {
                params.query.filtered.query.bool.should.push({
                    "match_phrase": {
                        "document_type": v.value.trim()
                    }
                });
            });
        }
        if ($("#fond").val().trim() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "fond": $("#fond").val().trim()
                }
            });
        }
        if ($("#opis").val().trim() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "opis": $("#opis").val().trim()
                }
            });
        }
        if ($("#delo").val().trim() != '') {
            params.query.filtered.query.bool.must.push({
                "match": {
                    "delo": $("#delo").val().trim()
                }
            });
        }
        if ($("#doc_id").val().trim() != '') {
            params.query.filtered.query.bool.must.push({
                "term": {
                    "id": $("#doc_id").val().trim()
                }
            });
        }
        // if ($("#doc_name").val().trim() != '') {
        //     params.query.filtered.query.bool.must.push({
        //         "match": {
        //             "document_name": {
        //                 "query": $("#doc_name").val().trim(),
        //                 "operator": "and"
        //             }
        //         }
        //     });
        // }

        var document_name = $("#doc_name").val().trim();
        if (document_name != '') {
            params.query.filtered.query.bool.must.push({
                "query_string": {
                    "query": document_name,
                    "default_field": "document_name",
                    "default_operator": "and"
                        // "analyze_wildcard": "true"
                }
            });
        }

        var author = $("#author").val().trim();
        if (author != '') {
            params.query.filtered.query.bool.must.push({
                //     "match_phrase": {
                //         "authors": {
                //             "query": author,
                //             "slop": 1 // макс расстояние между словами
                //         }
                //     }
                "query_string": {
                    "query": author,
                    "default_field": "authors",
                    "default_operator": "and"
                }
            });
        }

        if ($("#size").val().trim() != '') {
            params.size = parseInt($("#size").val().trim());
        }

        var sort = $("#sort").val().trim();
        if (sort && sort !== 'match') {
            var temp = {};
            if (jbd && sort == "document_date_b") {
                sort = "date_from";
            }
            if (sort == "id") {
                temp[sort] = "desc";
            }
            else {
                temp[sort] = "asc";
            }
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
        params = JSON.parse($('#params').val().trim());
    });

    $(".next").on('click', function() {
        if (response.hits.total > (params.size + params.from)) {
            params.from += params.size;
            $('#params').val(JSON.stringify(params));
            $.fn.get_data();
        }
    });
    $(".prev").on('click', function() {
        if (params.from > 0) {
            params.from -= params.size;
            $('#params').val(JSON.stringify(params));
            $.fn.get_data();
        }
    });

    $('#reset_dou').on('click', function(e) {
        e.preventDefault();
        $('#dou')[0].reset();
        $('#dou input[type=text]').val('').trigger('keyup');
        $('#dou').trigger('change');
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
    $("#reset_checkboxes").on('change', function() {
        if (this.checked) {
            $('#checkboxes div input').prop('checked', false);
        }
    });
    $("#checkboxes div input").on('change', function() {
        if ($("#checkboxes div input[type=checkbox]:checked").length == 0) {
            $('#reset_checkboxes').prop('checked', true);
        }
        else {
            $('#reset_checkboxes').prop('checked', false);
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
    
    //Copy links
    $('table.tablesorter').on('click', 'span.path', function() {
        //console.log($(this).attr('path'));
        var path = $(this).find('img').attr( "title" );
        copyTextToClipboard(path);
    });
});
