

//===================================================Создание формы на jquery ui
function createDialogSetting() {
  // формирование окна
  $("#setting").dialog({
    resizable: false,
    autoOpen: false,
    // height: 355,
    width: 500,
    modal: true,
    title: "Настройки",
    buttons: {
      "Применить": function() {
        saveSetting();
      },
    },
    hide: { effect: "fade", duration: 150 },
    show: { effect: "fade", duration: 100 }
  });



};
//===================================================Создание формы на jquery ui


//================================================================ Открыть форму
function openDialogSetting() {
  // заполняем поля
    $('#heightLocation').val(heightLocations);
    $('#nameLocations').val(nameLocations);
  // отобразить окно
    $("#setting").dialog( "open" );
};
//================================================================ Открыть форму


//========================================================== Сохранить настройки
function saveSetting(){
    nameLocations = $('#nameLocations').val();
    heightLocations = $('#heightLocation').val();

// сохраняем настройки в браузере
    localStorage.setItem('heightLocation', heightLocations);
    localStorage.setItem('nameLocations', nameLocations);

  // скрыть оконо
    $("#setting").dialog("close");
    getInfo('GetAll');
};
//========================================================== Сохранить настройки
