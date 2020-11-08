import sqlite3
import glob
import json

from shutil import copyfile

if __name__ == "__main__":
    database_file = 'buildings.db'
    img_folder = "images"

    user_submissions = glob.glob("*.json")

    conn = sqlite3.connect(database_file)
    c = conn.cursor()

    c.execute('''SELECT COUNT(*) FROM buildings''')
    entry_count = c.fetchone()[0]

    for json_file in user_submissions:
        with open(json_file, "r") as read_file:
            entry = json.load(read_file)

        filename, file_extension = os.path.splitext(entry["fileName"])
        
        entry_count+=1
        new_img_filename = str(entry_count)+file_extension

        img_src = filename + file_extension
        img_dest = img_folder + '/' + new_img_filename
        copyfile(img_src, img_dest)

        data_tuple = (
            new_img_filename, 
            entry["building"], 
            entry["city"], 
            entry["country"], 
            entry["upload_dt"],
            entry["upload_ip"]
        )

        c.execute('''INSERT INTO buildings(img_filename,building,city,country,upload_dt,upload_ip) 
                        VALUES(?,?,?,?,?,?)''', data_tuple
        )    
