import requests
import json

class WeatherService:
    def __init__(self):
        self.weather_api = "http://www.7timer.info/bin/api.pl" # api call

    def get_weather(self, latitude, longitude):
        params = {
            "lon": longitude,
            "lat": latitude,
            "product": "civil",
            "output": "json"
        }
        
        try:
            response = requests.get(self.weather_api, params=params)
            response.raise_for_status()  
            weather_data = response.json()
            
            forecast = weather_data.get("dataseries", [])[0] 
            weather_info = {
                "temperature": forecast["temp2m"],
                "weather_condition": forecast["weather"],
                "wind_speed": forecast["wind10m"]["speed"],
                "wind_direction": forecast["wind10m"]["direction"]
            }
            return weather_info
        except requests.exceptions.RequestException as e:
            return {"error": "Weather data currently unavailable", "details": str(e)}

    # def get_room_weather(self, room_id, latitude, longitude):
    #     try:
    #         weather = self.get_weather(latitude, longitude)
    #         return json.dumps({"room_id": room_id, "weather": weather})
    #     except Exception as e:
    #         return json.dumps({"error": str(e)})


# ws = WeatherService()
# print(ws.get_room_weather(room_id=1, latitude=52.9548, longitude=-1.1581))  
