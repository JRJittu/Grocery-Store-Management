# we can use django or flask as server

from flask import Flask,request, jsonify
import json
from flask_cors import CORS
import product_control 
import order_control
from sql_connection import get_sql_connection

app = Flask(__name__)
CORS(app)

connection = get_sql_connection()

# PRODUCTS
@app.route('/getproducts', methods=['GET'])
def get_all_products():
    all_products = product_control.getAllProducts(connection)
    response = jsonify(all_products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/deleteproduct', methods=['POST'])
def delete_product():
    return_id = product_control.deleteProduct(connection, request.form['product_id'])
    response = jsonify({
        'product_id': return_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insertproduct', methods=['POST'])
def insert_product():
    print(request)
    data_payload = json.loads(request.form['data'])
    print(data_payload)
    product_id = product_control.insertProduct(connection, data_payload)
    
    response = jsonify({
        'product_id': product_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')  
    
    return response



# ORDERS
@app.route('/getorders', methods=['GET'])
def get_all_orders():
    response = order_control.getAllOrders(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insertorder', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    order_id = order_control.insertOrder(connection, request_payload)
    response = jsonify({
        'order_id': order_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print("Starting Python Flask")
    app.run(host='0.0.0.0', port=5000)

# http://127.0.0.1:5000