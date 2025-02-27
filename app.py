from flask import Flask , request , jsonify , render_template
import json
import requests
from services.Weather_Service import WeatherService

app = Flask(__name__)

def load_rooms_data():
    with open('rooms.json', 'r') as file:
        data= json.load(file)
    return data['rooms']

rooms_data= load_rooms_data()
weather_service = WeatherService()
applications = []     #in-memory storage for applications

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rooms' , methods=['GET'])
def search_rooms():
    city = request.args.get('city')
    max_price = request.args.get('max_price')
    language = request.args.get('language')

    filtered_rooms = [
        room for room in rooms_data
        if (not city or room['location']['city'].lower() == city.lower()) 
            and (not max_price or room['price_per_month_gbp'] <= int(max_price))
            and (not language or language.lower() in (lang.lower() for lang in room['spoken_languages']))
    ]

    rooms_with_weather = []

    for room in filtered_rooms:
        location = room['location']
        weather_info = weather_service.get_weather(
            location['latitude'],
            location['longitude'])
        
        room_with_weather = room.copy()
        room_with_weather['weather']=weather_info
        rooms_with_weather.append(room_with_weather)

    return jsonify({"rooms":rooms_with_weather})



# @app.route('/apply',methods=['POST'])
# def apply_room():
#     application = request.json
#     application['status'] = 'pending' # set initial status to pending
#     applications.append(application)
#     return jsonify({"message":"Application submitted successfully", "application":application}) , 201

@app.route('/apply',methods=['POST'])
def apply_for_room():
    data = request.json
    room_id = data.get('roomId')
    user_name = data.get('userName')
    user_email = data.get('userEmail')
    user_message = data.get('userMessage')
    room_location = data.get('roomLoc')


    application = {
        'room_id':room_id,
        'name':user_name,
        'email':user_email,
        'message':user_message,
        'location':room_location,
        'status': 'Pending' 
    }

    print(f"New Application: {application}")

    applications.append(application)

    return jsonify({'message': 'Application Submitted Successfully!','application':application}),200


@app.route('/applications/<int:application_id>/cancel', methods=['POST'])
def cancel_application(application_id):
    if 0 <= application_id < len(applications):  # Ensure the application ID is valid
        applications[application_id]['status'] = 'Cancelled'
        return jsonify({'message': 'Application cancelled successfully!'})
    else:
        return jsonify({'message': 'Application not found!'}), 404


@app.route('/applications',methods=['GET'])
def view_applications():
    return jsonify({"applications":applications})



if __name__=='__main__':
    app.run(debug=True)