import pandas as pd
import requests
from pymongo import MongoClient
import time


archivo_csv = 'data/fire_nrt_M-C61_524843.csv'

df = pd.read_csv(archivo_csv, delimiter=',')
df.columns = df.columns.str.strip()

if 'latitude' not in df.columns or 'longitude' not in df.columns:
    print("Las columnas de latitud o longitud no están presentes en el archivo CSV.")
else:
    
    df['brightness_c'] = df['brightness'] - 273.15
    df['status'] = True  

    try:
        client = MongoClient('mongodb://root:root@localhost:27017') 
        db = client['test']
        collection = db['modisnrts']
        print("Conexión a MongoDB exitosa.")
    except ConnectionError as e:
        print(e)

    for index, row in df.iterrows():
        lat = row['latitude']
        long = row['longitude']
        
        uri = f"http://localhost:8080/reverse?format=json&lat={lat}&lon={long}"

        try:
            req = requests.get(uri)
            if req.status_code == 200:
                res = req.json()                
                if 'address' in res:
                    df.at[index, "address"] = res["address"].get("road", "Unknown")
                else:
                    print(f"Dirección no encontrada para lat: {lat}, long: {long}")
                    df.at[index,"address"] = {}
                
                record = df.iloc[index].to_dict()
                record['brightness_c'] = df.at[index, 'brightness_c']
                record['status'] = bool(df.at[index, 'status'])                
                
                collection.insert_one(record)
                print(f"Registro insertado para lat: {lat}, long: {long}.")
            
            else:
                print(f"Error en la solicitud para lat: {lat}, long: {long}. Código de estado: {req.status_code}")
        
        except Exception as e:
            print(f"Error al hacer la solicitud para lat: {lat}, long: {long}. Detalles: {e}")
        
        time.sleep(1)

    print("Proceso completado.")
