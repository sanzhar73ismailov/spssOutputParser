let template = new Map();

template.set(
  "Student",
  `
Цель: Оценить наличие различий в показателе "{Переменная}" между 2-мя группами: "{Группа 1}" и "{Группа 2}"

Группы независимые (несвязанные).
Обоснование выбора метода:
	Параметр "{Переменная}" является количественным. 
	Распределение в обеих группах соответствует нормальному.
	Две группы сравнения.
Метод сравнения:  Двусторонний критерий Стьюдента (t-критерий).
В группе "{Группа 1}": 
	количество наблюдений (n) {n1}, 
	среднее {mean1}, 
	стандратная ошибка среднего {ser1}.
В группе "{Группа 2}": 
	количество наблюдений (n) {n2}, 
	среднее {mean2}, 
	стандратная ошибка среднего {ser2}.
Значение Т критерия: {t}.
Уровень значимости (p): {p}.

Заключение.
{conclusion}

Более детальную информацию см. в файле "{название файла}".
`
);

template.set(
	"ChiSquared",
	`
Цель: Оценить влияние показателя "{Переменная1}" на показатель "{Переменная2}"
  
Обоснование выбора метода:
	Оба показателя являются качественными.
	Более двух групп сравнения.
Метод сранения:  Таблица сопряженности с оценкой различий с помощью критерия χ2.
Значение критерия (хи-квадрата Пирсона): {t}.
Уровень значимости (p): {p}.

Заключение.
Достоверные различия {prefixDiffFound}найдены (p {pMoreOrLessSign} 0.05).
{TextIfFound}

Таблицу сопряженности см. в файле "{название файла}".

Корреляция по Спирмену {не}найдена (p = {correlP}).
{ifCorrelFound}

Справочная таблица по значениям корреляции:

Значение	Интерпретация
до 0.2		Очень слабая корреляция
до 0.5		Слабая корреляция
до 0.7		Средняя корреляция
до 0.9		Высокая корреляция
свыше 0.9	Очень высокая корреляция
  `);
