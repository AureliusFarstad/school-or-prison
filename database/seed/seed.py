import os, sys
import sqlite3
import json

from shutil import copyfile

json_src = "metadata.json"
img_dir = "images/"

if __name__ == "__main__":
    try:
        outdir = sys.argv[1]
        if not os.path.isdir(outdir):
            os.mkdir(outdir)
    except IndexError as e:
        sys.exit("Specify output directory")

    database_file = outdir+'/buildings.db'
    img_folder = outdir + "/images"

    if not os.path.isdir(img_folder):
        os.mkdir(img_folder)

    with open(json_src, "r") as read_file:
        collection = json.load(read_file)

    conn = sqlite3.connect(database_file)
    with conn:
        c = conn.cursor()
        c.execute('''DROP TABLE IF EXISTS buildings''')
        c.execute('''CREATE TABLE buildings
                    (id INTEGER PRIMARY KEY, 
                    img_filename TEXT NOT NULL, 
                    building TEXT CHECK (building in ('SCHOOL', 'PRISON')),
                    city TEXT,
                    country TEXT,
                    source TEXT,
                    upload_dt TEXT,
                    upload_ip TEXT)''')

        for i, entry in enumerate(collection):
            filename, file_extension = os.path.splitext(entry["fileName"])

            new_img_filename = str(i+1)+file_extension
            
            img_src = 'images/' + filename + file_extension
            img_dest = img_folder + '/' + new_img_filename
            copyfile(img_src, img_dest)

            data_tuple = (
                new_img_filename, 
                entry["building"], 
                entry["city"], 
                entry["country"], 
                entry["source"]
            )

            c.execute('''INSERT INTO buildings(img_filename,building,city,country,source) 
                         VALUES(?,?,?,?,?)''', data_tuple
            )    

        c.execute('''DROP TABLE IF EXISTS votes''')
        c.execute('''CREATE TABLE votes
                    (building_id INTEGER NOT NULL, 
                    ip_address TEXT NOT NULL, 
                    vote TEXT CHECK (vote in ('SCHOOL', 'PRISON')),
                    UNIQUE (ip_address, building_id),
                    FOREIGN KEY (building_id) REFERENCES buildings(id))''')