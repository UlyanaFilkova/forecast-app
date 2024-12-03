<template>
  <div>
    <h2>Теория прогнозирования</h2>
    <p>
      В этом разделе вы можете изучить различные методы прогнозирования данных. Прогнозирование —
      это процесс оценки будущих значений на основе исторических данных.
    </p>
    <h3>Методы прогнозирования</h3>
    <ul>
      <li>
        <strong>Метод скользящего среднего:</strong> Использует средние значения за определенный
        период для прогнозирования будущих значений.
      </li>
      <li>
        <strong>Метод экспоненциального сглаживания:</strong> Учитывает более свежие данные с
        большим весом.
      </li>
      <li>
        <strong>Регрессионный анализ:</strong> Использует статистические методы для определения
        зависимости между переменными.
      </li>
    </ul>
    <h3>Дополнительные ресурсы</h3>
    <p>Для более подробной информации вы можете посетить следующие ссылки:</p>
    <ul>
      <li>
        <a href="https://ru.wikipedia.org/wiki/Прогнозирование" target="_blank"
          >Прогнозирование на Википедии</a
        >
      </li>
      <li>
        <a
          href="https://www.statisticshowto.com/probability-and-statistics/statistics-definitions/forecasting/"
          target="_blank"
          >Forecasting - Statistics How To</a
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.theory {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h2 {
  color: #333;
}

h3 {
  color: #007bff;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

li {
  margin: 5px 0;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
