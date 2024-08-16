from datetime import datetime

def insertOrder(myDB, order):
    cursor = myDB.cursor()

    order_query = """
        INSERT INTO orders (customer_name, total, datetime) VALUES (%s, %s, %s)
    """
    order_data = (order['customer_name'], order['total'], datetime.now().date())

    try:
        cursor.execute(order_query, order_data)
        order_id = cursor.lastrowid

        order_details_query = """
            INSERT INTO order_details (order_id, product_id, qty, total_price) VALUES (%s, %s, %s, %s)
        """
        order_detail_data = []

        for order_record in order['order_details']:
            order_detail_data.append([
                order_id, 
                int(order_record['product_id']),
                float(order_record['qty']),
                float(order_record['total_price'])
            ])

        cursor.executemany(order_details_query, order_detail_data)
        myDB.commit()

    except Exception as e:
        myDB.rollback()
        print(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()

    return order_id


def getOrderDetail(myDB, order_id):
    cursor = myDB.cursor()

    query2 = """
        SELECT order_details.order_id, order_details.qty, order_details.total_price,
        products.name, products.price_per_unit FROM order_details
        LEFT JOIN products ON order_details.product_id = products.product_id
        WHERE order_details.order_id = %s
    """
    data = (order_id, )
    cursor.execute(query2, data)
    records = []

    for (order_id, qty, total_price, pName, ppu) in cursor:
        records.append({
            'order_id': order_id,
            'qty': qty,
            'total_price': total_price,
            'name': pName,
            'price_per_unit': ppu,
        })

    cursor.close()
    return records


def getAllOrders(myDB):
    cursor = myDB.cursor()

    query = "SELECT * FROM orders"
    cursor.execute(query)
    response = []
    for (order_id, customer_name, total, dt) in cursor:
        response.append({
            'order_id': order_id,
            'customer_name': customer_name,
            'total': total,
            'datetime': dt
        })

    cursor.close()

    for record in response:
        record['order_details'] = getOrderDetail(myDB, record['order_id'])

    return response