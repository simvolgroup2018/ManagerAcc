//Если с английского на русский, то передаём вторым параметром true.
transliterate = (
	function() {
		var
			rus = "щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "o i x w . z . . . s . f . d u l t p b q r k v y j g h c n e a . m".split(/ +/g)
		;
		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
			}
			return text;
		}
	}
)();

function convertDate(date) {
  if(date == null){
      return '';
  }

  var values = [ date.getDate(), date.getMonth() + 1 ];
  for( var id in values ) {
    values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
  }
  var result = '' + values[ 0 ] + '.' + values[ 1 ] + '.' + date.getFullYear();
  return result;
}

//===================================================Создание формы на jquery ui
function createDialogNewProject() {
  // формирование окна создания проекта
  $("#addProject").dialog({
    resizable: false,
    autoOpen: false,
    // height: 255,
    width: 500,
    modal: true,
    title: "Новый проект",
    buttons: {
      "Создать": function() {
        // $( this ).dialog( "close" );
        addProject();
      },
    },
    hide: { effect: "fade", duration: 150 },
    show: { effect: "fade", duration: 100 }
  });

  // автокомплит в окне создания проекта
  $('#clientNewProject').autoComplete({
    minChars: 1,
    source: function (term, suggest) {
      term = term.toLowerCase();

      var suggestions = [];
      for (i = 0; i < clientList.length; i++)
      if (~clientList[i].toLowerCase().indexOf(term)) suggestions.push(clientList[i]);

      if(suggestions.length == 0){
          var translit = transliterate(term, true)

          for (i = 0; i < clientList.length; i++)
          if (~clientList[i].toLowerCase().indexOf(translit)) suggestions.push(clientList[i]);
      }
      suggest(suggestions);
    }
  });

  // срок проекта
  $("#srokNewProject").datepicker({
    dateFormat: "dd.mm.yy",
    dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    firstDay: 1,
    constrainInput: true,
    minDate: new Date(),
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                    'Июл','Авг','Сен','Окт','Ноя','Дек'],
    onSelect: function(dateText, inst, extensionRange) {
      // $("#srokNewProject").val( $("#srokNewProject").datepicker( "getDate"));
      $("#srokNewProject").removeClass('false');
    }
  });

};


//================================================= Открыть форму нового проекта
function openDialogNewProject() {
  //очистить поля от старых данных
  $("#clientNewProject").removeClass('false');
  $("#jobNewProject").removeClass('false');
  $("#srokNewProject").removeClass('false');
  $("#clientNewProject").val('');
  $("#jobNewProject").val('');
  $("#srokNewProject").datepicker( "setDate", "" );


  //заполнить на форме список участков
  let divLocationsNewPorject = document.getElementById('locationsNewProject')
  divLocationsNewPorject.innerHTML = "";

  $.ajax({
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    url: urlServ1C + 'GetLocationsList',
    // data: data,
    success: function (result) {
      // console.log('2');
      // console.log(result);
      objJSON = eval(result);

      for (var i = 0; i < objJSON.length; i++) {
        let locationData = objJSON[i];
        addLocation(locationData, divLocationsNewPorject)
      }
    },
    dataType: "text",
    async:false,
    error: function( jqXHR , textStatus, errorThrown ){
      console.log(textStatus);
    }
  });

  $( ".selector" ).datepicker({
    dateFormat: "dd.mm.yy",
    dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    firstDay: 1,
    constrainInput: true,
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                    'Июл','Авг','Сен','Окт','Ноя','Дек'],
    minDate: new Date(),
    onSelect: function(dateText, inst, extensionRange) {
      document.getElementById(inst.id).parentNode.parentNode.getElementsByTagName('input')[0].checked=true;
    }
  });

    // отобразить окно
    $("#addProject").dialog( "open" );

  };


  function addLocation(locationData, divLocationsNewPorject) {
    // <label for="insurance1">Insurance 1<input type="text" name="srokNewTask" class="text ui-widget-content ui-corner-all inp"></label>
    // <input type="checkbox" name="insurance1" id="insurance1">
    var divDOM = document.createElement('div');
    divDOM.className = "locationNewProject";
    divDOM.setAttribute('id', locationData.guid);

    var inputDOM = document.createElement('input');
    inputDOM.setAttribute('type', "checkbox");
		inputDOM.setAttribute('onchange', "checkLocation(this);");

    var labelDOM = document.createElement('label');
    labelDOM.innerHTML = locationData.name;

    var divSrokDOM = document.createElement('div');
    divSrokDOM.className = "kalendar";

    var inputDateDOM = document.createElement('input');
    inputDateDOM.setAttribute('type', "text");
    inputDateDOM.setAttribute('id', "date_"+locationData.guid);
    inputDateDOM.className = "selector inputDate";

    var divSrokIconDOM = document.createElement('div');
    divSrokIconDOM.className = "iconKalendar";

    divSrokDOM.appendChild(inputDateDOM);
    divSrokDOM.appendChild(divSrokIconDOM);

    var clearDOM = document.createElement('div');
    clearDOM.className = "clearboth";

    // labelDOM.appendChild(inputDateDOM);

    divDOM.appendChild(inputDOM);
    divDOM.appendChild(labelDOM);
    divDOM.appendChild(divSrokDOM);
    divDOM.appendChild(clearDOM);

    divLocationsNewPorject.appendChild(divDOM);
  };

//======================================= открываем календарь при выборе участка
	function checkLocation(elemCheck) {
		var divDate = $($(elemCheck).parent().children('div.kalendar')[0]).children('input');
		if (elemCheck.checked) {
			divDate.datepicker("show");
		}else {
			divDate.datepicker("setDate", "");
		}
	};


  //=====================================================Создание проекта в базе
  function addProject() {
    console.log('create project');
    //проверить заполнение всех полей
    var client = $("#clientNewProject").val();
    var vidRab = $("#jobNewProject").val();
    var srok = convertDate($("#srokNewProject").datepicker("getDate"));

    console.log(document.getElementById('srokNewProject').value);

    if(client.length == 0){
      $("#clientNewProject").focus();
      return;
    };

    if(vidRab.length == 0){
      $("#jobNewProject").focus();
      return;
    };

    if(srok.length == 0){
      $("#srokNewProject").focus();
      return;
    };

    //формируем JSON
    result = '{'
    result += '"Заказчик":"' + client + '",';
    result += '"ВидРабот":"' + vidRab + '",';
    result += '"СрокСдачи":"' + srok + '",';
    result += '"Участки":[';
    var nodes = document.getElementById('locationsNewProject').childNodes;

    for(var i=0; i<nodes.length;i++){
        if(nodes[i].getElementsByTagName('input')[0].checked){
            var dataTask = document.getElementById('date_'+nodes[i].id).value;
            if (dataTask.length != 10) {
              dataTask = srok;
            }
            result += '{"guid":"' + nodes[i].id + '",';
            result += '"Срок":"' + dataTask + '"},';
        }
    };

    result += ']}';
    console.log(result);
    //отправить данные на сервер
    getInfo('CreateProject', result);


    //скрыть оконо создания проекта

    $("#addProject").dialog( "close" );
  };


  /*checkValue*/
  function  checkValue(el){
    if (el.value.length == 0) {
      el.classList.add('false');
    }else {
      el.classList.remove('false');
    }
  }
