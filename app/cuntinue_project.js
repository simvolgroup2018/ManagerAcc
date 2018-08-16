


//===================================================Создание формы на jquery ui
function createDialogContinueProject() {
  // формирование окна
  $("#continueProject").dialog({
    resizable: false,
    autoOpen: false,
    // height: 255,
    width: 500,
    modal: true,
    title: "Продолжение проекта",
    buttons: {
      "Создать": function() {
        continueProject();
      },
    },
    hide: { effect: "fade", duration: 150 },
    show: { effect: "fade", duration: 100 }
  });
};
//===================================================Создание формы на jquery ui
//*
//*
//================================================= Открыть форму нового проекта
function openDialogContinueProject(infoProject) {
// заполняем поле проекта
  $('#nameProject').val(infoProject.client + ' - ' + infoProject.vidRabot)
  $('#nameProject').attr('guid', infoProject.guid)

//заполнить на форме список участков
  let divLocationsNewPorject = document.getElementById('locationsContinue')
  divLocationsNewPorject.innerHTML = "";

  $.ajax({
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    url: urlServ1C + 'GetLocationsList',
    success: function (result) {
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

// подключаем ui datepicker
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
  $("#continueProject").dialog( "open" );
};
//================================================= Открыть форму нового проекта
//*
//*
//====================================================== Создание проекта в базе
function continueProject() {
  console.log('start continueProject');

//формируем JSON
  var result = {
      guidProject: $('#nameProject').attr('guid'),
      locations: []
  };

  $('#locationsContinue').children().each(function (index, value) {
    if ($(this).children('input')[0].checked) {
        var location = {
          guid: $(this).attr('id'),
          srok: $('#date_' + $(this).attr('id')).val()
        }
        result.locations.push(location);
    };
  });

  // console.log(JSON.stringify(result));

//отправляем данные на сервер
  getInfo('ContinueProject', JSON.stringify(result));


// скрыть оконо
  $("#continueProject").dialog("close");
};
//====================================================== Создание проекта в базе
