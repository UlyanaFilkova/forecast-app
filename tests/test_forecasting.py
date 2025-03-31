import unittest
import json
from main import app

class TestForecastingMethods(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_linear_regression_forecast(self):
        request_data = {
            "inputData": ["5", "10", "50", "15", "100"],
            "forecast_steps": 5
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        response_data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn("Linear Regression", response_data)
        self.assertEqual(len(response_data["Linear Regression"]), 5)

    def test_arima_forecast(self):
        request_data = {
            "inputData": ["5", "10", "50", "15", "100"],
            "forecast_steps": 5,
            "order": [1, 1, 1]
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        response_data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn("ARIMA", response_data)
        self.assertEqual(len(response_data["ARIMA"]), 5)

    def test_random_forest_forecast(self):
        request_data = {
            "inputData": ["5", "10", "50", "15", "100"],
            "forecast_steps": 5
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        response_data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn("Random Forest", response_data)
        self.assertEqual(len(response_data["Random Forest"]), 5)

    def test_knn_forecast(self):
        request_data = {
            "inputData": ["5", "10", "50", "15", "100"],
            "forecast_steps": 5,
            "n_neighbors": 3
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        response_data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn("KNN", response_data)
        self.assertEqual(len(response_data["KNN"]), 5)

    def test_invalid_input(self):
        request_data = {
            "inputData": ["abc", "xyz"],
            "forecast_steps": 5
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.get_data(as_text=True))
        self.assertIn("error", response_data)

    def test_forecast_steps_missing(self):
        request_data = {
            "inputData": ["5", "10", "50", "15", "100"]
        }
        response = self.app.post('/forecast', data=json.dumps(request_data), content_type='application/json')
        self.assertEqual(response.status_code, 500)

if __name__ == "__main__":
    unittest.main()