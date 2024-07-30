from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/cogni_data', methods=['GET','POST'])
def get_data():
  response = requests.get('https://datausa.io/api/data?drilldowns=Nation&measures=Population')
  
  if response.status_code == 200:
    data = response.json()
    return data
  
  else:
    return {"error": "Failed to fetch data"}, response.status_code
   

if __name__ == '__main__':
  app.run(debug=True)