from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

db_config = {
    'user': 'root',
    'password': '123456', 
    'host': 'localhost',
    'database': 'apq_db' 
}

def get_db_connection():
    """Create and return a new database connection."""
    return mysql.connector.connect(**db_config)

@app.route('/', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', '').lower()

    # Normalize the role to match the database
    if role == 'customer':
        role = 'user'  # Map 'customer' to 'user'
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = "SELECT * FROM login WHERE email = %s AND role = %s"
        cursor.execute(query, (email, role))
        user = cursor.fetchone()

        if user and user['password'] == password:
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/recommendation', methods=['POST'])
def get_recommendation():
    """Fetch recommendations based on user-selected options."""
    data = request.json
    question_id = data.get('question_id')
    selected_option = data.get('selected_option')
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = """
    SELECT r.recommendation_text 
    FROM recommendations r 
    JOIN options o ON r.option_id = o.option_id
    WHERE o.question_id = %s AND o.option_id = %s
    """
    cursor.execute(query, (question_id, selected_option))
    recommendation = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if recommendation:
        return jsonify(recommendation)
    else:
        return jsonify({"message": "No recommendation found"}), 404

@app.route('/questions', methods=['GET'])
def fetch_questions():
    try:
        aoi_id = request.args.get('aoi_id')
        if not aoi_id:
            return jsonify({"error": "Area of Impact ID is required"}), 400
        
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """     
            SELECT 
                q.question_id, 
                q.question_text, 
                q.is_active, 
                a.aoi_text, 
                o.option_id, 
                o.option_text, 
                o.weightage,
                ass.assess_text, 
                rec.recommendation_text
            FROM 
                question q
            LEFT JOIN 
                aoi a ON q.aoi_id = a.aoi_id
            LEFT JOIN 
                options o ON q.question_id = o.question_id
            LEFT JOIN 
                assessment ass ON o.option_id = ass.option_id
            LEFT JOIN 
                recommendations rec ON o.option_id = rec.option_id
            WHERE 
                q.is_active = TRUE AND q.aoi_id = %s;
        """
        cursor.execute(query, (aoi_id,))
        results = cursor.fetchall()

        questions = {}
        for row in results:
            question_id = row['question_id']
            if question_id not in questions:
                questions[question_id] = {
                    'id': question_id,
                    'question_text': row['question_text'],
                    'aoi': row['aoi_text'],
                    'options': []
                }
            questions[question_id]['options'].append({
                'id': row['option_id'],
                'option_text': row['option_text'],
                'weightage': row['weightage'],
                'assessment': row['assess_text'],
                'recommendations': row['recommendation_text']
            })

        return jsonify(list(questions.values()))

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        connection.close()


@app.route('/save_user_responses', methods=['POST'])
def save_user_responses():
    data = request.json
    print("Received data:", data)  # Log incoming data for debugging

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for response in data:
            # Ensure all necessary keys exist in the response
            if 'question_id' in response and 'option_id' in response:
                # Use the current timestamp for recorded_at if not provided
                recorded_at = response.get('recorded_at', datetime.now().isoformat())

                # Convert the recorded_at to MySQL-compatible datetime format
                if recorded_at.endswith('Z'):
                    recorded_at = recorded_at[:-1]  # Remove the 'Z'
                recorded_at = datetime.strptime(recorded_at, '%Y-%m-%dT%H:%M:%S.%f').strftime('%Y-%m-%d %H:%M:%S')

                # Insert user response into the database
                cursor.execute(
                    'INSERT INTO user_response (question_id, option_id, recorded_at) VALUES (%s, %s, %s)',
                    (response['question_id'], response['option_id'], recorded_at)
                )
            else:
                print("Missing keys in response:", response)  # Log if keys are missing

        conn.commit()
        return jsonify({"message": "Responses saved successfully!"}), 201
    except Exception as e:
        print("Error saving responses:", e)  # Log the error
        return jsonify({"error": "Failed to save responses"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/user_responses_graph', methods=['GET'])
def get_user_responses():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  # Ensure we get dictionaries instead of tuples

        # Fetch user responses and their corresponding weightages, assessment, and recommendation
        cursor.execute('''
            SELECT ur.user_response_id, ur.option_id, o.weightage, o.assess_text, o.recommendation_text
            FROM user_response ur
            LEFT JOIN options o ON ur.option_id = o.option_id;
        ''')
        weightages = cursor.fetchall()

        response_data = []
        for row in weightages:
            response_data.append({
                'weightage': row['weightage'],
                'assessment': row['assess_text'] if row['assess_text'] else '',
                'recommendation': row['recommendation_text'] if row['recommendation_text'] else ''
            })

        return jsonify(response_data), 200
    except Exception as e:
        print("Error fetching responses:", e)
        return jsonify({"error": "Failed to fetch responses"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/customer_questions', methods=['GET'])
def fetch_customer_questions():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT q.question_id, q.question_text, q.is_active, a.aoi_text, 
               o.option_id, o.option_text, o.weightage
        FROM question q
        LEFT JOIN aoi a ON q.aoi_id = a.aoi_id
        LEFT JOIN options o ON q.question_id = o.question_id
        WHERE q.is_active = TRUE
        """
        cursor.execute(query)
        results = cursor.fetchall()

        questions = {}
        for row in results:
            question_id = row['question_id']
            if question_id not in questions:
                questions[question_id] = {
                    'id': question_id,
                    'question_text': row['question_text'],
                    'aoi': row['aoi_text'],
                    'options': []
                }
            questions[question_id]['options'].append({
                'id': row['option_id'],
                'option_text': row['option_text'],
                'weightage': row['weightage']
            })

        return jsonify(list(questions.values())), 200

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route('/api/areas_of_impact', methods=['GET'])
def get_areas_of_impact():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)  # Fetch results as dictionaries
        cursor.execute("SELECT aoi_id, aoi_text FROM aoi")  # Select specific fields
        areas_of_impact = cursor.fetchall()  # Fetch all records
        
        return jsonify(areas_of_impact)  # Return as JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
