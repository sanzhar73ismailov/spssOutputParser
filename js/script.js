//const message = ""; // Try edit me
//document.querySelector("#header").innerHTML = message;
//console.log(message);
registerRadioButtons();

function registerRadioButtons() {
  for (radio of document.getElementsByClassName("statMethodsClass")) {
    radio.onclick = selectTemplate;
  }
}

function selectTemplate() {
  document.getElementById("parseResult").value = template.get(this.id)
    ? template.get(this.id)
    : "нет шаблона";
}

function getSelectedRadioButtonId() {
  for (rb of document.getElementsByName("statRadios")) {
    if (rb.checked) return rb.id;
  }
  return "";
}

function generateReportButtonRun() {
  let selectedId = getSelectedRadioButtonId();
  document.getElementById("statResult").value = selectedId == "Custom" ?
    getCustomExample() : document.getElementById("statResult").value;
  let statResult = document.getElementById("statResult").value;
  let parseResultTextArea = document.getElementById("parseResult");

  if (parseResultTextArea.value == "") {
    alert("Нужно выбрать метод статистики");
    return;
  }

  let templateText = template.get(selectedId);

  try {
    parseResultTextArea.value = generateTemplateTxt(selectedId, templateText, statResult);
  }
  catch (err) {
    parseResultTextArea.value = `Ошибка: ${err.message}`;
  }


}
