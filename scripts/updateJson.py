#update circle json to contain density and k-value
#also remove unnecessary information

import json
import sys
import re

ALGORITHM = sys.argv[1]
JSONPATH = 'graphIndexed.mtx_'+ALGORITHM+'_circle.json'
OUTPATH  = 'graphCircle.json'

#open json circle file for modification
def getJsonData(file_path):
    #ARG: string path
    #RET: json dict (tree hierarchy)

    with open(file_path, 'r') as json_file:
        json_data = json.load(json_file)
    json_file.close()

    return json_data

#update json data
def updateJson(json_data):
    #ARG: json dict
    #RET: 

    if len(json_data['fl']) != 0:

        size, density, k_value = str(json_data['name']).split(' ')
        k_value = re.sub('[()]', '', k_value)
        del json_data['fl']
        del json_data['name']

        c_id = str(json_data['index'])

        json_data['density'] = density
        json_data['k_value'] = k_value

    else:
        del json_data['fl']
        del json_data['name']

        json_data['size'] = 0

    if 'children' in json_data:
        for child in json_data['children']:
            updateJson(child)

#dump updated json data into a file
def dumpJson(json_data, file_path):
    with open(file_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)
    json_file.close()

def main():
    json_data = getJsonData(JSONPATH)
    updateJson(json_data)
    dumpJson(json_data, OUTPATH)

if __name__ == '__main__':
    main()