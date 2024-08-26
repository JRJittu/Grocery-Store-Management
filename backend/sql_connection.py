# myCursor.execute(query)           myCursor will pointing to product table, and once it iterate it, we cannot use it again 

# allProducts = myCursor.fetchall() # since cursor can change position, you can store result in list
# print(allProducts)

# for x in myCursor:
#     print(x)                  # only once you can iterate via myCursor


import mysql.connector
__connection = None  # declaration of global variable

def get_sql_connection():
    global __connection

    if __connection is None:
        __connection = mysql.connector.connect(
            user='root',
            password='jittu777',
            host='aws-db-instances.cb68gm4e4w16.eu-north-1.rds.amazonaws.com',
            database='grocerystore'
        )
    
    return __connection
