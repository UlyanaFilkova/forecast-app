from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.holtwinters import SimpleExpSmoothing


# Метод экспоненциального сглаживания
def exponential_smoothing_forecast(data, smoothing_factor):
    """
    Прогнозирование с использованием метода экспоненциального сглаживания (ручная реализация).

    :param data: Массив чисел (исторические данные).
    :param smoothing_factor: Сглаживающий фактор (alpha).
    :return: Сглаженные значения.
    """

    N = len(data)  # Число периодов
    smoothed_values = [0] * (N + 1)  # Массив для сглаженных значений
    smoothed_values[0] = data[0]  # Начальное значение

    # Расчет сглаженных значений
    for i in range(1, N + 1):
        smoothed_values[i] = smoothing_factor * data[i - 1] + (1 - smoothing_factor) * smoothed_values[i - 1]

    return [smoothed_values[N]]

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
        if not data or method not in ['exponential_smoothing', 'linear_regression','arima']:
            return jsonify({"error": "Invalid input"}), 400

        if method == 'exponential_smoothing':
            smoothing_factor = request_data.get('smoothing_factor', 0.8)
            forecast = exponential_smoothing_forecast(data, smoothing_factor)
            print(forecast)
        elif method == 'linear_regression':
            forecast = linear_regression_forecast(data, forecast_steps)
  
        elif method == 'arima':
            order = request_data.get('order', (1, 1, 1))
            forecast = arima_forecast(data, forecast_steps, order)

        return jsonify({"forecast": forecast})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

# Пример использования
# if __name__ == "__main__":
#     historical_data = [100, 105, 110, 120, 125, 130, 135, 140]  # Исторические данные
#     steps_to_forecast = 5  # Количество шагов для прогнозирования

#     # Экспоненциальное сглаживание
#     es_predictions = exponential_smoothing_forecast(historical_data, 0.8)
#     print("Прогноз с использованием экспоненциального сглаживания:", es_predictions)

#     # Линейная регрессия
#     lr_predictions = linear_regression_forecast(historical_data, steps_to_forecast)
#     print("Прогноз с использованием линейной регрессии:", lr_predictions)

#     # ARIMA
#     arima_predictions = arima_forecast(historical_data, steps_to_forecast)
#     print("Прогноз с использованием ARIMA:", arima_predictions)