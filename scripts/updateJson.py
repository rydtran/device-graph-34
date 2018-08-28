#update circle json to contain density and k-value
#also remove unnecessary information

import json

JSONPATH = 'graphIndexed.mtx_34_circle.json'
NUCLPATH = 'graphIndexed.mtx_34_NUCLEI'
OUTPATH  = 'graphCircle.json'

#open json circle file for modification
def getJsonData(file_path):
    with open(file_path, 'r') as json_file:
        json_data = json.load(json_file)
    json_file.close()

    return json_data

#open nucli file to extract k-value and density info
def getNuclData(file_path):
    nucl_data = {}

    with open(file_path, 'r') as nucl_file:
        lines = nucl_file.readlines()
    nucl_file.close()

    for line in lines:
        entry = {}
        infoarray = line.split(' ')
        entry[infoarray[0]] = {}

        k_value  = infoarray[1]
        density  = infoarray[4]

        entry[infoarray[0]]['k_value']  = k_value
        entry[infoarray[0]]['density']  = density
        nucl_data.update(entry)

    return nucl_data

#update json data
def updateJson(json_data, nucl_data):

    if len(json_data['fl']) != 0:
        del json_data['fl']
        del json_data['name']

        c_id = str(json_data['index'])

        if c_id in nucl_data:
            json_data['density'] = nucl_data[c_id]['density']
            json_data['k_value'] = nucl_data[c_id]['k_value']
        else:
            json_data['density'] = "unknown"
            json_data['k_value'] = "unknown"
    else:
        del json_data['fl']
        del json_data['name']

    if 'children' in json_data:
        for child in json_data['children']:
            updateJson(child, nucl_data)

#dump updated json data into a file
def dumpJson(json_data, file_path):
    with open(file_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)
    json_file.close()

def main():
    json_data = getJsonData(JSONPATH)
    nucl_data = getNuclData(NUCLPATH)
    updateJson(json_data, nucl_data)
    dumpJson(json_data, OUTPATH)

if __name__ == '__main__':
    main()