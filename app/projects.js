
function openProjects() {
  $("#load").show();
  $("#mainProjects").hide();
  var divProjects = document.getElementById('containerProjects');
  // divProjects.innerHTML = "";

  if (divProjects.className == "containerCloseProjects") {
      divProjects.className = "containerProjects";
      getInfo('GetProjects');
  }else{
      divProjects.className = "containerCloseProjects";
      $( "#mainProjects" ).accordion( "destroy" );
  };
};


function updateProjects(responseText) {
  var divProjects = document.getElementById('mainProjects');
  var Projects = eval(responseText);
  console.log(Projects);

  for (var i = 0; i < Projects.length; i++) {
      let projectData = Projects[i];
      let divProducts = newProject(divProjects, projectData);

      for (var j = 0; j < projectData.Products.length; j++) {
        let productData = projectData.Products[j];
        addProductProject(divProducts, productData, projectData);
      };
  };
  $("#mainProjects")
    .accordion({
      header: "> div > h3",
      active: false,
      collapsible: true,
      heightStyle: "content",
    });

    //  функция срывает колесо загрузки
    $("#load").hide();
    $("#mainProjects").show();
};



function newProject(divProjects, project) {
  var div = document.createElement('div'); //блок проекта
  div.className = "group";
  div.setAttribute('priority', project.priority);
  div.setAttribute('guid', project.guid);
  //div.setAttribute('onclick', "openSetting(this);")

  var title = document.createElement('h3'); //h3 Элемент -> (клиент, срок, вид работы)
  title.className = "title";
  title.innerHTML = '<div class="client">' +  project.client  +  " - " + project.number +'</div>';

  var srok = document.createElement('div');
  srok.className = "srok";
  srok.innerHTML = project.srok;

  var vidRabot = document.createElement('div');
  vidRabot.className = "vidRabot";
  vidRabot.innerHTML = project.job;

  var product = document.createElement('div');
  product.className = "product";
  product.innerHTML = " изделий - " + project.Products.length;

  title.appendChild(srok);
  title.appendChild(vidRabot);
  title.appendChild(product);

  var tasksProduct = document.createElement('div');
  tasksProduct.className = "tasksProjekt";
  //tasksProjekt.innerHTML = "text info";

  div.appendChild(title);
  div.appendChild(tasksProduct);

  divProjects.appendChild(div);
  return tasksProduct;
}


function addProductProject(divProducts, productData, projectData) {
  var div = document.createElement('div'); //блок проекта
  div.className = "task";
  // div.setAttribute('onclick', "openSetting(this);");
  div.setAttribute('guid', productData.guid);
  div.setAttribute('srok', productData.srok);
  //div.innerHTML = "- " + taskData.priorityProduct + " " + taskData.nameProduct + "     " + taskData.srokTask;

  var ProduktName = document.createElement('div'); //h3 Элемент -> (клиент, срок, вид работы)
  ProduktName.className = "ProduktName";
  ProduktName.innerHTML = ' - '+ projectData.number + "_" + productData.priority + " изд. " + productData.name;

  var TaskSrok = document.createElement('div'); //h3 Элемент -> (клиент, срок, вид работы)
  TaskSrok.className = "TaskSrok";
  TaskSrok.innerHTML = productData.srok;

  // <input type="checkbox" class="state" onchange="onChangeStateTask(this)" guid="' + taskData.guidTask +'">
  div.appendChild(ProduktName);
  div.appendChild(TaskSrok);

  divProducts.appendChild(div);
}
