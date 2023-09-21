function generateTemplateTxt(radioId, templateText, statResultText) {
  let result = "нет функции generate";

  nunjucks.configure({ autoescape: false });
  
  if (statResultText.trim() == "") {
    throw new Error("Нет данных в области результатов стат. обработки");
  }
  let lines = statResultText.split("\n");

  if (radioId == "Student") {
    result = generateStudent(templateText, lines);
  } else if (radioId == "ChiSquared") {
    result = generateChiSquared(templateText, lines);
  } else if (radioId == "Anova") {
    result = generateAnova(templateText, lines);
  } else {
    throw new Error("Неизвестный radioId: ${radioId}");
  }
  return result;
}

function generateStudent(templateText, lines) {
  let lineZeroInd = getLineIndexByText(lines, "Среднее");
  let lineZero = lines[lineZeroInd];
  let lineOne = lines[lineZeroInd + 1];
  let lineTwo = lines[lineZeroInd + 2];

  let varibale = lineOne.split("\t")[0].trim();
  let secVaribale = lineZero.split("\t")[1].trim();
  let groupName1 = secVaribale + " " + lineOne.split("\t")[1].trim();
  let groupName2 = secVaribale + " " + lineTwo.split("\t")[1].trim();
  let n1 = lineOne.split("\t")[2].trim();
  let mean1 = lineOne.split("\t")[3].trim();
  let ser1 = lineOne.split("\t")[5].trim();
  let n2 = lineTwo.split("\t")[2].trim();
  let mean2 = lineTwo.split("\t")[3].trim();
  let ser2 = lineTwo.split("\t")[5].trim();
  let lineResult = searchLine(lines, "Предполагается равенство дисперсий");

  let t = parseFloatWithTwoDigits(lineResult.split("\t")[4]);
  let p = parseFloatWithTwoDigits(lineResult.split("\t")[6]);
  let dif = parseFloatWithTwoDigits(lineResult.split("\t")[5].trim());
  let timesMore = parseFloatWithTwoDigits(mean1 > mean2 ? mean1 / mean2 : mean2 / mean1);
  let groupStronger = mean1 > mean2 ? groupName1 : groupName2;
  let groupWeaker = mean1 > mean2 ? groupName2 : groupName1;
  let moreByOrIn = timesMore < 1.2 ? `на ${dif}` : `в ${timesMore} раз`;
  let conclusion = "Достоверных различий не найдено (p > 0,05)";
  if (p < 0.056) {
    conclusion = `Найдены достоверные различия(p < 0,05).
      В группе "${groupStronger}" среднее значение было больше ${moreByOrIn}, чем в группе "${groupWeaker}" (${mean1}±${ser1} против ${mean2}±${ser2}).`;
  }

  let mapReplaces = new Map();

  mapReplaces.set("{Переменная}", varibale);
  mapReplaces.set("{Группа 1}", groupName1);
  mapReplaces.set("{Группа 2}", groupName2);
  mapReplaces.set("{n1}", n1);
  mapReplaces.set("{mean1}", mean1);
  mapReplaces.set("{ser1}", ser1);
  mapReplaces.set("{n2}", n2);
  mapReplaces.set("{mean2}", mean2);
  mapReplaces.set("{ser2}", ser2);
  mapReplaces.set("{t}", t);
  mapReplaces.set("{p}", p);
  mapReplaces.set("{dif}", dif);
  mapReplaces.set("{conclusion}", conclusion);

  return replaceAllPlaceHoders(templateText, mapReplaces);
}

function generateChiSquared(templateText, lines) {
  let templObject = {};
  try {
    if (searchLine(lines, "Таблица сопряженности") == "") {
      throw new Error("Нет результатов хи-квадрата");
    }
    let lineResult = "";
    lineResult = searchLine(lines, "Хи-квадрат Пирсона");

    let lineVarNames = lines[getLineIndexByText(lines, "Процент") + 1].split("\t")[0];
    templObject.var1 = lineVarNames.split("*")[0].trim();
    templObject.var2 = lineVarNames.split("*")[1].trim();
    templObject.t = parseFloatWithTwoDigits(lineResult.split("\t")[1]);
    templObject.p = parseFloatWithTwoDigits(lineResult.split("\t")[3]);
    templObject.prefixDiffFound = templObject.p <= 0.05 ? "" : "не ";
    templObject.pMoreOrLessSign = templObject.p <= 0.05 ? "<" : ">";
    correlLine = searchLine(lines, "Корреляция Спирмена");
    templObject.correlP = parseFloatWithTwoDigits(correlLine.split("\t")[3]);
    templObject.notPrefix = templObject.correlP < 0.05 ? "" : "не ";
    templObject.correlT = parseFloatWithTwoDigits(correlLine.split("\t")[2]);
    templObject.correlDescr = getCorrelDescr(templObject.correlT);
    templObject.ifCorrelFound = templObject.correlP < 0.05 ? `Уровень корреляции {correlT} - {correlDescr}` : "";

    return nunjucks.renderString(templateText, templObject);

  } catch (err) {
    throw err;
  }
}

function generateAnova(templateText, lines) {
  //alert("Anova");
  try {
    if (searchLine(lines, "Однофакторный дисперсионный анализ") == "") {
      throw new Error("Нет результатов Однофакторного дисперсионного анализа");
    }


    let lineResult = "";
    lineResult = searchLine(lines, "Хи-квадрат Пирсона");

    let lineVarNames = lines[getLineIndexByText(lines, "Процент") + 1].split("\t")[0];
    let var1 = lineVarNames.split("*")[0].trim();
    let var2 = lineVarNames.split("*")[1].trim();
    let t = parseFloatWithTwoDigits(lineResult.split("\t")[1]);
    let p = parseFloatWithTwoDigits(lineResult.split("\t")[3]);
    //Достоверные различия {prefixDiffFound}найдены (p {pMoreOrLessSign} 0).
    let prefixDiffFound = p <= 0.05 ? "" : "не ";
    let pMoreOrLessSign = p <= 0.05 ? "<" : ">";
    let correlLine = searchLine(lines, "Корреляция Спирмена");
    let correlP = parseFloatWithTwoDigits(correlLine.split("\t")[3]);
    let notPrefix = correlP < 0.05 ? "" : "не ";
    let correlT = parseFloatWithTwoDigits(correlLine.split("\t")[2]);
    let correlDescr = getCorrelDescr(correlT);

    let ifCorrelFound = correlP < 0.05 ? `Уровень корреляции {correlT} - {correlDescr}` : "";

    let mapReplaces = new Map();
    mapReplaces.set("{Переменная1}", var1);
    mapReplaces.set("{Переменная2}", var2);
    mapReplaces.set("{t}", t);
    mapReplaces.set("{p}", p);
    mapReplaces.set("{prefixDiffFound}", prefixDiffFound);
    mapReplaces.set("{pMoreOrLessSign}", pMoreOrLessSign);
    //mapReplaces.set("{correlT}", correlT);
    mapReplaces.set("{correlP}", correlP);
    mapReplaces.set("{не}", notPrefix);
    mapReplaces.set("{ifCorrelFound}", ifCorrelFound);

    return replaceAllPlaceHoders(templateText, mapReplaces);
  } catch (err) {
    throw err;
  }

}

function getCorrelDescr(p) {
  let descr = "";
  if (p < 0.2)
    descr = "Очень слабая корреляция";
  else if (p < 0.5)
    descr = "Слабая корреляция";
  else if (p < 0.7)
    descr = "Средняя корреляция";
  else if (p < 0.9)
    descr = "Высокая корреляция";
  else if (p <= 1)
    descr = "Очень высокая корреляция";
  else
    throw "Too Big"
  return descr;
}

function searchLine(lines, searchString) {
  for (let line of lines) {
    if (line.includes(searchString))
      return line;
  }
  return "";
}

function getLineIndexByText(lines, searchString) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString))
      return i;
  }
  return -1;
}

function replaceSymbols(text, arrSimbols) {
  for (let s of arrSimbols) {
    text = text.replaceAll(s, "");
  }
  return text;
}

function replaceAbc(text) {
  return replaceSymbols(text.trim(), "abcdefg".split(""));
}

function replaceAllPlaceHoders(template, map) {
  for (let k of map.keys())
    template = template.replaceAll(k, map.get(k));
  return template;
}

function parseFloatWithTwoDigits(text) {
  return parseFloat(text).toFixed(2);
}
