var container = document.getElementById('container');

class Location {
  constructor(arrData, index, containerDIV) {
    this.name = arrData[index].name;
    this.id = 'Location' + index;
    this.div = document.createElement('div'); //главный блок участка
    this.div.className = "block";

    this.divTitle = document.createElement('div'); //блок title
    this.divTitle.className = "titleLocation";
    this.divTitle.innerHTML = this.name;

    var btnAddTask = document.createElement('div');
    btnAddTask.className = "buttonAdd";
    btnAddTask.setAttribute('onclick', 'openDialogNewTask(this);');
    btnAddTask.setAttribute('location', this.name);
    btnAddTask.setAttribute('title', 'Добавить задачу');

    var countWork = document.createElement('div');
    countWork.className = "countWork";
    // countWork.innerHTML = arrData[index].Projects.length;

    this.divTitle.appendChild(btnAddTask);
    this.divTitle.appendChild(countWork);

    this.divMain = document.createElement('div'); //блок main
    this.divMain.className = "mainLocation";
    this.divMain.id = 'Location' + index;

    // this.divFooter = document.createElement('div'); //блок footer
    // this.divFooter.className = "footerLocation";

    this.div.appendChild(this.divTitle);
    this.div.appendChild(this.divMain);
    // this.div.appendChild(this.divFooter);

    containerDIV.appendChild(this.div);
  }

  addProject(project) {
    var div = document.createElement('div'); //блок проекта
    div.className = "group";
    div.setAttribute('priority', project.priority);
    div.setAttribute('guid', project.guid);
    //div.setAttribute('onclick', "openSetting(this);")

    var title = document.createElement('h3'); //h3 Элемент -> (клиент, срок, вид работы)
    title.className = "title contextProject";
    title.setAttribute('guid', project.guid);
    title.setAttribute('client', project.client  +  " - " + project.number);
    title.setAttribute('vidRabot', project.job);

    var client = document.createElement('div');
    client.className = "client contextProject";
    client.innerHTML = project.client  +  " - " + project.number;

    title.appendChild(client);

    var srok = document.createElement('div');
    srok.className = "srok contextProject";
    srok.setAttribute('guid', project.guid);
    srok.setAttribute('client', project.client  +  " - " + project.number);
    srok.setAttribute('vidRabot', project.job);
    srok.innerHTML = project.Tasks[0].srokTask;

    var vidRabot = document.createElement('div');
    vidRabot.className = "vidRabot contextProject";
    vidRabot.setAttribute('guid', project.guid);
    vidRabot.setAttribute('client', project.client  +  " - " + project.number);
    vidRabot.setAttribute('vidRabot', project.job);
    vidRabot.innerHTML = project.job;

    var product = document.createElement('div');
    product.className = "product contextProject";
    product.setAttribute('guid', project.guid);
    product.setAttribute('client', project.client  +  " - " + project.number);
    product.setAttribute('vidRabot', project.job);
    product.innerHTML = " задач - " + project.Tasks.length;

    title.appendChild(srok);
    title.appendChild(vidRabot);
    title.appendChild(product);

    var tasksProjekt = document.createElement('div');
    tasksProjekt.className = "tasksProjekt";
    //tasksProjekt.innerHTML = "text info";

    div.appendChild(title);
    div.appendChild(tasksProjekt);

    // div.innerHTML = '<h3>' + rabota.client + '<div class="srok"></div><div class="vidRabot">Установка прожекторов на кронштейнах_5шт</div></h3><div class="text"><p>Lorem</p></div>';
    this.divMain.appendChild(div);
    return tasksProjekt;
  }

  addTask(project, taskData, projectData) {
    // console.log(task);
      var div = document.createElement('div'); //блок проекта
      div.className = "task";
      // div.setAttribute('onclick', "openSetting(this);");
      div.setAttribute('guid', taskData.guidTask);
      div.setAttribute('srok', taskData.srokTask);
      //div.innerHTML = "- " + taskData.priorityProduct + " " + taskData.nameProduct + "     " + taskData.srokTask;

      var ProduktName = document.createElement('div'); //h3 Элемент -> (клиент, срок, вид работы)
      ProduktName.className = "ProduktName";
      ProduktName.innerHTML = ' - '+ projectData.number + "_" + taskData.priorityProduct + " изд. " + taskData.nameProduct;

      var TaskComment = document.createElement('div'); //h3 Элемент -> (клиент, срок, вид работы)
      TaskComment.className = "TaskComment";
      TaskComment.innerHTML = taskData.commentTask;


      var TaskSrok = document.createElement('div'); //h3 Элемент -> (клиент, срок, вид работы)
      TaskSrok.className = "TaskSrok";
      TaskSrok.innerHTML = '<input type="text" class="selector inputDate" srok="'+ taskData.srokTask
      +'" guid="' + taskData.guidTask +'"> <div class="stateTask" onclick="onChangeStateTask(this)" guid="' + taskData.guidTask +'"></div> ';

      // <input type="checkbox" class="state" onchange="onChangeStateTask(this)" guid="' + taskData.guidTask +'">
      div.appendChild(ProduktName);
      div.appendChild(TaskComment);
      div.appendChild(TaskSrok);

      project.appendChild(div);
  }
}
