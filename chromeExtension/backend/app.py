from flask import Flask, request, jsonify

app = Flask(__name__)

# Example in-memory data store
user_activity = []  # To store URLs visited by the user
copied_text = []    # To store copied text

@app.route('/store-data', methods=['POST'])
def store_data():
    data = request.get_json()
    
    # Extract data from the request
    page_title = data.get('pageTitle')
    page_url = data.get('pageURL')
    copied_text_data = data.get('copiedText')  # Corrected variable name

    # Store the data (could be saved in a database or file)
    user_activity.append({
        "title": page_title,
        "url": page_url,
        "copied_text": copied_text_data
    })

    print(f'Received Data: {data}')
    return jsonify({"status": "success"}), 200

@app.route('/activity', methods=['GET'])
def show_activity():
    return jsonify(user_activity)  # Return user activity in JSON format

if __name__ == '__main__':
    app.run(debug=True)
