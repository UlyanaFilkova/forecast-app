from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.neighbors import KNeighborsRegressor
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import SimpleExpSmoothing

# Метод простой линейной регрессии
def linear_regression_forecast(data, forecast_steps):
    """
    Прогнозирование с использованием линейной регрессии.

    :param data: Массив чисел (исторические данные).
    :param forecast_steps: Количество шагов для прогнозирования.
    :return: Прогнозируемые значения.
    """
    # Создаем массивы индексов
    x = np.arange(len(data)).reshape(-1, 1)
    y = np.array(data)

    # Обучаем модель линейной регрессии
    model = LinearRegression()
    model.fit(x, y)

    # Прогнозируем будущие значения
    x_future = np.arange(len(data), len(data) + forecast_steps).reshape(-1, 1)
    predictions = model.predict(x_future)

    return predictions.tolist()

# Метод ARIMA
def arima_forecast(data, forecast_steps, order=(1, 1, 1)):
    """
    Прогнозирование с использованием модели ARIMA.

    :param data: Массив чисел (исторические данные).
    :param forecast_steps: Количество шагов для прогнозирования.
    :param order: Параметры ARIMA (p, d, q).
    :return: Прогнозируемые значения.
    """
    # Обучаем модель ARIMA
    model = ARIMA(data, order=order)
    model_fit = model.fit()

    # Прогнозируем будущие значения
    forecast = model_fit.forecast(steps=forecast_steps)

    return forecast.tolist()

# Метод случайных лесов
def random_forest_forecast(data, forecast_steps):
    """
    Прогнозирование с использованием случайного леса (Random Forest) на несколько шагов.
    """
    # Подготовка данных для обучения модели
    x = np.arange(len(data)).reshape(-1, 1)  # Изначальные индексы
    y = np.array(data)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(x, y)

    predictions = []
    current_data = data.copy()

    # Прогнозируем будущие шаги
    for i in range(forecast_steps):
        # Обновляем x и y для прогноза следующего шага
        x_current = np.arange(len(current_data)).reshape(-1, 1)  # Индексы на основе текущих данных
        y_current = np.array(current_data)  # Текущие данные для предсказания
    

        model.fit(x_current, y_current)  # Обучаем модель на обновленных данных
        next_prediction = model.predict([[len(current_data)]])[0]  # Прогнозируем следующее значение

        predictions.append(next_prediction)
        current_data.append(next_prediction)  # Добавляем прогноз в текущие данные для следующего шага

    return predictions

# Метод KNN (k-Nearest Neighbors)
def knn_forecast(data, forecast_steps, n_neighbors=3):
    """
    Прогнозирование с использованием метода ближайших соседей (KNN) на несколько шагов.
    """
    # Подготовка данных для обучения модели
    x = np.arange(len(data)).reshape(-1, 1)  # Изначальные индексы
    y = np.array(data)

    model = KNeighborsRegressor(n_neighbors=n_neighbors)
    model.fit(x, y)

    predictions = []
    current_data = data.copy()

    # Прогнозируем будущие шаги
    for i in range(forecast_steps):
        # Обновляем x и y для прогноза следующего шага
        x_current = np.arange(len(current_data)).reshape(-1, 1)  # Индексы на основе текущих данных
        y_current = np.array(current_data)  # Текущие данные для предсказания

        model.fit(x_current, y_current)  # Обучаем модель на обновленных данных
        next_prediction = model.predict([[len(current_data)]])[0]  # Прогнозируем следующее значение

        predictions.append(next_prediction)
        current_data.append(next_prediction)  # Добавляем прогноз в текущие данные для следующего шага

    return predictions

app = Flask(__name__)
CORS(app)

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        request_data = request.get_json()
        method = request_data.get('method')
        data = []
        for x in request_data.get('data', []):
            try:
                if x:  
                    data.append(float(x))
            except ValueError:
                continue 

        forecast_steps = int(request_data.get('forecast_steps', 5))

        print("Received data:", data)
        print("Received method:", method)
        if not data or method not in ['knn', 'linear_regression','arima', 'random_forest']:
            return jsonify({"error": "Invalid input"}), 400

 
        if method == 'linear_regression':
            forecast = linear_regression_forecast(data, forecast_steps)
  
        elif method == 'arima':
            order = request_data.get('order', (1, 1, 1))
            forecast = arima_forecast(data, forecast_steps, order)
        elif method == 'random_forest':
            forecast = random_forest_forecast(data, forecast_steps)
        elif method == 'knn':
            n_neighbors = request_data.get('n_neighbors', 3)
            forecast = knn_forecast(data, forecast_steps, n_neighbors)

        return jsonify({"forecast": forecast})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)