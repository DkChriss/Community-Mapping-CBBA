import pandas as pd
from pymongo import MongoClient


archivo_csv = 'data/fire_nrt_M-C61_524843.csv'  # Reemplaza con la ruta a tu archivo

df = pd.read_csv(archivo_csv, delimiter=',')

df['brightness_c'] = df['brightness'] - 273.15
df['status'] = True  
try:
    client = MongoClient('mongodb://root:root@192.168.116.88:27017') 
    db=client['test'] 
    dbs=client.list_database_names()
    print (dbs)
    coleccion = db['modisnrts']
    coleccion.insert_many(df.to_dict('records'))
    print("Datos guardados en MongoDB exitosamente.")
except ConnectionError as e:
    print(e)




