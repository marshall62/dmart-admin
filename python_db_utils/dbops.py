import pymongo
import os



conn = None

def connect_mongo():
    CONNECTION_STRING=os.getenv("MONGO_DATASOURCE")
    print(f'Connecting to {CONNECTION_STRING}')
    conn = pymongo.MongoClient(CONNECTION_STRING)
    print(f'received {conn}')
    return conn


def close_mongo(conn):
    conn.close()


def get_works ():
    db=connect_mongo()
    artworks = db.collection['works']
    n = artworks.count_documents({})
    print(f'there are {n} artworks')

def clean_works():
    """Delete column/field from a collection"""
    db = connect_mongo()
    artworks = db.collection['works']
    artworks.update_many({}, {"$unset": {'exemplarTitle': '', 'date': '', 'dimensions': ''}})
    close_mongo(db)  