//===================================================Создание формы на jquery ui
function createDialogNewTask() {
  // формирование окна
  $("#AddTask").dialog({
      resizable: false,
      autoOpen: false,
      height: 255,
      width: 440,
      modal: true,
      buttons: {
        "Создать": function() {
          addTask();
        },
      },
      hide: { effect: "fade", duration: 150 },
      show: { effect: "fade", duration: 100 }
  });

  // автокомплит на поле проекта
  $("#projectTask").autocomplete({
    minLength: 2,
    select: function ( event, ui ) {
        console.log(ui.item.guid);
        $("#AddTask").attr("guidProject", ui.item.guid);
        getInfo('GetProductsList', ui.item.guid);
    }
  });

  // выбор изделий проекта из списка
  $("#productTask").combobox({
    select: function ( event, ui ) {
      console.log(ui.item.value);
      $("#AddTask").attr("guidProduct", ui.item.guid);
    }
  });

  // срок задачи
  $("#srokNewTask").datepicker({
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
      $("#AddTask").attr("srokNewTask", $("#srokNewTask").datepicker( "getDate"));
    }
  });
};
//===================================================Создание формы на jquery ui

//=================================================== Открыть форму новой задачи
function openDialogNewTask(btn) {
  // запрос получения списка проектов с 1С
  getInfo('GetProjectsList');

  // очистить поля от старых данных
  $("#projectTask").val('');
  $("#productTask").combobox("setText", "");
  $("#srokNewTask").datepicker("setDate", new Date());

  // записываем текущие параметры в атрибуты
  $("#AddTask").attr("guidProject", "");
  $("#AddTask").attr("location", btn.getAttribute('location'));

  // устанавливаем заголовок окна
  $("#AddTask").dialog( "option", "title", "Новая задача на участок ( " + btn.getAttribute('location') + ' )');

  // отобразить окно
  $("#AddTask").dialog( "open" );
};
//=================================================== Открыть форму новой задачи


//========================================================Создание задачи в базе
function addTask() {
//формируем JSON
  var project = $("#AddTask").attr("guidProject");
  var product = $("#AddTask").attr("guidProduct");
  var location = $("#AddTask").attr("location");
  var srok = $('#srokNewTask').val();

  if(!product){ product = '' };

  if(!project){ return };

  var result = {
      project: project,
      product: product,
      location: location,
      srok: srok
  };

  console.log(result);

//отправляем данные на сервер
  getInfo('CreateTask', JSON.stringify(result));

//скрыть оконо
  $("#AddTask").dialog( "close" );
};
//========================================================Создание задачи в базе
