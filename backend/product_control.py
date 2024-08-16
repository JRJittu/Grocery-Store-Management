def getAllProducts(myDB):
    myCursor = myDB.cursor()
    
    query = """
        SELECT products.product_id, products.name, uom_table.uom_name, products.price_per_unit
        FROM grocerystore.products
        INNER JOIN uom_table ON products.uom_id = uom_table.uom_id
    """

    myCursor.execute(query)
    response = []

    for (product_id, name, uom_name, price_per_unit) in myCursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'uom_name': uom_name,
            'price_per_unit': price_per_unit
        })
    myCursor.close()
    return response



def insertProduct(myDB, product):
    myCursor = myDB.cursor()

    query = """
        INSERT INTO products (name, uom_id, price_per_unit) VALUES (%s, %s, %s)
    """

    data = (product['name'], product['uom_id'], product['price_per_unit'])
    myCursor.execute(query, data)

    myDB.commit()
    myCursor.close()

    return myCursor.lastrowid



def deleteProduct(myDB, product_id):
    mycursor = myDB.cursor()
    query = ("DELETE FROM  products where product_id=" + str(product_id))
    mycursor.execute(query)
    mycursor.close()
    myDB.commit()


# if __name__ == '__main__':
#     myDB = get_sql_connection()

    # products = getAllProducts(myDB)
    # print("All Products:")
    # for product in products:
    #     print(product)
    

    # last_row_id = insertProduct(myDB, {
    #     'name': 'cabbage',
    #     'uom_id': '1',
    #     'price_per_unit': '20'
    # }) 
    # print("Item inserted in row:", last_row_id)


    # deleteProduct(myDB, 13)


