//const message = ""; // Try edit me
//document.querySelector("#header").innerHTML = message;
//console.log(message);

function selectTemplate(id) {
  //alert(id);
  document.getElementById("parseResult").value = template;

}

function generateReportButtonRun() {
  let statResult = document.getElementById("statResult").value;
  let parseResultTextArea = document.getElementById("parseResult");
  let templateText = parseResultTextArea.value;

  if(templateText == "") {
    alert("Нужно выбрать метод статистики");
    return;
  }
  

  let lines = statResult.split("\n");
  let lineZero = lines[0];
  let lineOne = lines[1];
  let lineTwo = lines[2];
  //"{Переменная}" между 2-мя группами:
  let varibale = lineOne.split("\t")[0].trim();
  let secVaribale = lineZero.split("\t")[1].trim();
  //{Группа 1}
  let groupName1 = secVaribale + " " + lineOne.split("\t")[1].trim();
  //{Группа 2}
  let groupName2 = secVaribale + " " + lineTwo.split("\t")[1].trim();
  let n1 = lineOne.split("\t")[2].trim();
  let mean1 = lineOne.split("\t")[3].trim();
  let ser1 = lineOne.split("\t")[5].trim();
  let n2 = lineTwo.split("\t")[2].trim();
  let mean2 = lineTwo.split("\t")[3].trim();
  let ser2 = lineTwo.split("\t")[5].trim();
  let lineResult = "";
  for (let line of lines) {
    if (line.includes("Предполагается равенство дисперсий")) {
      lineResult = line;
      break;
    }
  }
  //Значение Т критерия: {t}.
  let t = parseFloat(lineResult.split("\t")[4].trim());
  //Уровень значимости (p): {p}.
  let p = parseFloat(lineResult.split("\t")[6].trim());
  let dif = parseFloat(lineResult.split("\t")[5].trim());

  templateText = templateText.replace("{Переменная}", varibale);
  templateText = templateText.replace("{Группа 1}", groupName1);
  templateText = templateText.replace("{Группа 2}", groupName2);
  templateText = templateText.replace("{n1}", n1);
  templateText = templateText.replace("{mean1}", mean1);
  templateText = templateText.replace("{ser1}", ser1);
  templateText = templateText.replace("{n2}", n2);
  templateText = templateText.replace("{mean2}", mean2);
  templateText = templateText.replace("{ser2}", ser2);
  templateText = templateText.replace("{t}", t);
  templateText = templateText.replace("{p}", p);
  templateText = templateText.replace("{dif}", dif);

  console.log("varibale=" + varibale);
  console.log("groupName1=" + groupName1);
  console.log("groupName2=" + groupName2);
  console.log("n1=" + n1);
  console.log("n2=" + n2);
  console.log("mean1=" + mean1);
  console.log("ser1=" + ser1);
  console.log("mean2=" + mean2);
  console.log("ser2=" + ser2);
  console.log("t=" + t);
  console.log("p=" + p);
  console.log("dif=" + dif);

  parseResultTextArea.value = templateText;
}


