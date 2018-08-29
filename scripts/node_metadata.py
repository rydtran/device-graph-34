#creates json files for each node
import json
import os
import sys
import shutil

THRESHOLD = int(sys.argv[2]) 
ALGORITHM = sys.argv[1]

NUCLIPATH = 'graphIndexed.mtx_'+ALGORITHM+'_NUCLEI'
CIRCLPATH = 'graphIndexed.mtx_'+ALGORITHM+'_circle.json'
INDEXPATH = 'data/indexRevDict.json'
OUTPATH   = 'data/nodes/'

def assure_path_exists(path):
    dir_path = os.path.dirname(path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    elif os.path.exists(dir_path):
        shutil.rmtree(path)

def openIndexFile():
    with open(INDEXPATH, 'r') as index_file:
        json_data = json.load(index_file)
        index_file.close()

        return json_data

def openNucliFile():
    with open(NUCLIPATH, 'r') as nucli_file:
        lines = nucli_file.readlines()
        nucli_file.close()

        return lines

def createNodeFiles(index_data, nucli_data):

    assure_path_exists(OUTPATH)

    for line in nucli_data:
        line = line.split(' ')
        index = line[0]
        devices = line[7:-1]

        entry = {}
        dups = {}
        original_ids = []

        for device in devices:
            new = index_data[device]
            if new not in dups:
                original_ids.append(new)
                dups.update({new:0})

        if len(original_ids) > THRESHOLD:
            entry[index] = original_ids

            file_name = OUTPATH + index + '.json'
            with open(file_name, 'w') as out_file:
                json.dump(entry, out_file)
                out_file.close()


def main():
    index_data = openIndexFile()
    nucli_data = openNucliFile()
    createNodeFiles(index_data, nucli_data)

if __name__ == '__main__':
    main()