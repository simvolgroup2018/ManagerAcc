'use strict';
let urlServ1C = 'http://192.168.1.252/pp/hs/Plan/';
let clientList;     //список всех клиентов
let locationList;   //список всех участков
let Locations;
let nameLocations = "";
let heightLocations = '42vh';

//Обработчик для создания обьекта отправки запросов
function getXmlHttp() {
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
};


/*--------------------------- Отрисовка блоков ---------------------------*/
function updateNew() {
  console.log(Locations);
  //очищаем контейнер
  container.innerHTML = "";

  //создаем участки
  for (var i = 0; i < Locations.length; i++) {
    if(nameLocations.indexOf('[' + Locations[i].name + ']') < 0){

    }else{
      // console.log('пропускаем');
      continue;
    }

    let location = new Location(Locations, i, container);
    let locationData = Locations[i];

    //заполняем проекты
    for (var j = 0; j < locationData.Projects.length; j++) {
      let projectData = Locations[i].Projects[j];
      let project = location.addProject(projectData);

      //заполняем задачи по проекту
      for (var l = 0; l < projectData.Tasks.length; l++) {
        let taskData = projectData.Tasks[l];
        location.addTask(project, taskData, projectData);
      };
    };
    /*--------------*/

    // активируем аккордион
    $("#" + location.id)
      .accordion({
        header: "> div > h3",
        active: false,
        collapsible: true,
        heightStyle: "content",
      });
      $( ".selector" ).datepicker({
        dateFormat: "dd.mm.yy",
        minDate: new Date(),
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        firstDay: 1,
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
                        'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
                        'Июл','Авг','Сен','Окт','Ноя','Дек'],
        onSelect: function(value, date) {
         var currentInput = document.getElementById(date.id);
         var infoTask = {
            guid: currentInput.getAttribute('guid'),
            date: value
          };
          var str = JSON.stringify(infoTask);
          getInfo('SetSrokTask', str);
          // console.log(value);
          currentInput.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('srok')[0].innerHTML = value
          // console.log(currentInput.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('srok')[0]);
        }
    });

  };

  var arrSrok = document.getElementsByClassName('inputDate');
  for (var i = 0; i < arrSrok.length; i++) {
    $('#' + arrSrok[i].getAttribute('id')).datepicker( "setDate", arrSrok[i].getAttribute('srok'));
    // console.log(arrSrok[i].getAttribute('id'));
  }
  $('div.mainLocation').css('height', heightLocations);
};

// ================================================== изменение состояния задачи
function onChangeStateTask(value){
  var result = confirm('Задача выполнена?');
  if(result){
    var infoTask = {
       guid: value.getAttribute('guid'),
       state: 'готово'
     };
     var str = JSON.stringify(infoTask);
     getInfo('SetStateTask', str);
     value.parentNode.parentNode.parentNode.parentNode.style.display = 'none';


     //$(value).closest("div.group")
     //$(value).closest("div.group").attr('guid')

     var parentDIV = value.parentNode.parentNode.parentNode.parentNode;
     var guidProject = parentDIV.getAttribute('guid');
     var clientProject = parentDIV.getElementsByClassName('client')[0].innerHTML;
     var vidRabProject = parentDIV.getElementsByClassName('vidRabot')[0].innerHTML;

     var infoProject = {
       guid: guidProject,
       client: clientProject,
       vidRabot: vidRabProject
     };

     openDialogContinueProject(infoProject);
  }else{
    value.checked = false;
  };
};
// ================================================== изменение состояния задачи


function getInfo(param, data = '') {
  // console.log("getInfo");
  var req = getXmlHttp();
  req.open('POST', urlServ1C + param, true, "admin", "admin");
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        // console.log(req.responseText);
        if( param == 'GetAll'){
          Locations = eval(req.responseText);
          updateNew();
        }else if(param == 'SetSrokTask'){
          // getInfo('GetAll');
        }else if(param == 'SetStateTask'){
          // getInfo('GetAll');
        }else if(param == 'GetProjects') {
          updateProjects(req.responseText);
        }else if(param == 'GetProjectsList') {
          var objJSON = eval(req.responseText);
          $("#projectTask").autocomplete( "option", "source", objJSON);
        }else if(param == 'GetProductsList') {
          document.getElementById('productTask').innerHTML = req.responseText;
        }else if(param == 'CreateProject') {
          getInfo('GetAll');
        }else if(param == 'ContinueProject') {
          getInfo('GetAll');
        }else if(param == 'CreateTask') {
          getInfo('GetAll');
        }
      } else {
        // Вывод ошибки в title
        console.log("Код ошибки сервера: " + req.status);
      }
    }
  };
  req.send(data);
}

// ===================================================== автообновление страницы
function autoRefresh() {
  var checkBox = document.getElementById('autoRefresh');
  if(checkBox.checked){
      console.log("update");
      getInfo('GetAll');
  };
};
// ===================================================== автообновление страницы

//======================================================== При загрузке страницы
$(function() {
  console.log("start");

  // читаем настройки из браузера
  var qqq = localStorage.getItem('heightLocation');

  if(qqq == null){
    localStorage.setItem('heightLocation', heightLocations);
  }else{
    heightLocations = localStorage.getItem('heightLocation');
  }

  var qqq = localStorage.getItem('nameLocations');

  if(qqq == null){
    localStorage.setItem('nameLocations', nameLocations);
  }else{
    nameLocations = localStorage.getItem('nameLocations');
  }

  // nameLocations = "[sdsdsdsd][Контроль предложений]";
// блокируем стандартное контекстное меню
  document.oncontextmenu = function() {return false;};

  getClientList();
  createDialogNewProject();
  createDialogContinueProject();
  createDialogNewTask();
  createDialogSetting();

  setInterval(autoRefresh, 3000);

  console.log("GetAll");
  getInfo('GetAll');



});
//======================================================== При загрузке страницы


function getClientList() {
  $.ajax({
    type: 'POST',
    contentType: "application/json; charset=utf-8",
    url: urlServ1C + 'GetClientList',
    dataType: "text",
    success: function (result) {clientList = result.split(',');},
    error: function( jqXHR , textStatus, errorThrown ){console.log(textStatus);}
  });
}




//================================================= Обработчик контекстного меню
$(document).ready(function() {
    // Вешаем слушатель события нажатие кнопок мыши для всего документа:
    $(document).mousedown(function(event) {
        // Получаем элемент на котором был совершен клик:
        var target = $(event.target);

        // Удаляем предыдущие вызванное контекстное меню:
        $('.context-menu').remove();
        // console.log('mousedown');
        // console.log(event.which);
        // console.log(event.target);

        // Проверяем нажата ли именно правая кнопка мыши:
        if (event.which === 3)  {
            // console.log(target);
            // проверяем где вызвано контекстное меню
            if($(target).hasClass('contextProject')){
              var guid = $(target[0]).attr('guid');
              var client = $(target[0]).attr('client');
              var vidRabot = $(target[0]).attr('vidRabot');

              // Создаем меню:
              $('<div/>', {class: 'context-menu'})
              .css({left: event.pageX+'px', top: event.pageY+'px'})
              .appendTo('body') // Присоединяем наше меню к body документа:
              .append( // Добавляем пункты меню:
                 // $('<ul/>').append('<li><a href="#" onclick="addTaskProject("'+target[0].id+'");">Добавить задачи</a></li>')
                 $('<ul/>').append('<li><a href="#" class="contextItem addTaskProject" item="addTaskProject" guid="' + guid + '" client="' + client + '" vidRabot="' + vidRabot + '">Добавить задачи в проект</a></li>')
                           .append('<li><a href="#" class="contextItem">Добавить изделия в проект</a></li>')
                           .append('<li><a href="#" class="contextItem">Закрыть проект</a></li>')
                     )
               .show('fast'); // Показываем меню с небольшим эффектом jQuery, очень хорошо подходит для меню
            }else if ($(target).hasClass('titleLocation')) {
              // console.log(target);
              // Создаем меню:
              $('<div/>', {class: 'context-menu'})
              .css({left: event.pageX+'px', top: event.pageY+'px'})
              .appendTo('body') // Присоединяем наше меню к body документа:
              .append( // Добавляем пункты меню:
                 // $('<ul/>').append('<li><a href="#" onclick="addTaskProject("'+target[0].id+'");">Добавить задачи</a></li>')
                 $('<ul/>').append('<li><a href="#" class="hideLocation" item="addTaskProject" targetId="'+target[0].textContent+'">Скрыть</a></li>')
                     )
               .show('fast'); // Показываем меню с небольшим эффектом jQuery, очень хорошо подходит для меню
            }
         };

         // Обработка клика по меню
         if (event.which === 1)  {
           if($(target[0]).hasClass('hideLocation')){
             console.log($(target[0]).attr('targetId'));
             nameLocations += '[' + $(target[0]).attr('targetId') + ']\n';
            localStorage.setItem('nameLocations', nameLocations);
             getInfo('GetAll');
           };

           if($(target[0]).hasClass('contextItem')){

             if($(target[0]).hasClass('contextItem')){
               var parentDIV = target[0];
               var guidProject = parentDIV.getAttribute('guid');
               var clientProject = parentDIV.getAttribute('client');
               var vidRabProject = parentDIV.getAttribute('vidRabot');

               var infoProject = {
                 guid: guidProject,
                 client: clientProject,
                 vidRabot: vidRabProject
               };

               console.log(infoProject);
               openDialogContinueProject(infoProject);
             };


           };
         };
    });
});
//================================================= Обработчик контекстного меню
