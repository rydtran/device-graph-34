#creates json files for each node
import json
import os
import sys
import shutil
import time

ALGORITHM = sys.argv[1]
THRESHOLD = int(sys.argv[2])

NUCLIPATH = 'graphIndexed.mtx_'+ALGORITHM+'_NUCLEI'
CIRCLPATH = 'graphIndexed.mtx_'+ALGORITHM+'_circle.json'
INDEXPATH = 'data/indexDict.json'
ONESPATH  = 'graphOmaha.json'
OUTPATH   = 'data/nodes/'

def assure_path_exists(path):
    dir_path = os.path.dirname(path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    elif os.path.exists(dir_path):
        shutil.rmtree(path)
        os.makedirs(dir_path)

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

    #assure_path_exists(OUTPATH)
    with open(ONESPATH, 'r') as index_file:
        json_data = json.load(index_file)
        index_file.close()

    node_ones = {}
    for line in nucli_data:
        line = line.split(' ')
        index = line[0]
        devices = line[7:-1]

        dups = {}
        original_ids = []
        file_name = OUTPATH + index + '.json'

        if len(devices) > THRESHOLD: #and not os.path.isfile(file_name):

            entry = {}
            for device in devices:
                new = index_data[device]
                if new not in dups:
                    original_ids.append(new)
                    dups.update({new:0})

            # t0 = time.time()
            dups = {}
            entry[index] = original_ids
            ones = []
            others = []
            for i in range(0, len(devices)-1, 2):
                check = index_data[devices[i]] + "." + index_data[devices[i+1]]
                if check not in dups:
                    #print(check)
                    if check in json_data:
                        ones.append([index_data[devices[i]],index_data[devices[i+1]]])
                        if index not in node_ones:
                            node_ones.update({index:1})
                        #print("y")
                    else:
                        others.append([index_data[devices[i]],index_data[devices[i+1]]])
                    dups.update({check:0})

            entry[1]=ones
            entry["0 and -1"]=others

            with open(file_name, 'w') as out_file:
                json.dump(entry, out_file, indent=4)
                out_file.close()

    with open('node_ones.json','w') as out_file:
        json.dump(node_ones, out_file, indent=4)
        out_file.close()

def main():

    index_data = openIndexFile()
    nucli_data = openNucliFile()
    FILEINPUT   = 'graphOmaha'
    FILEOUTPUT  = 'graphOmaha.json'

    data = {}

    with open(FILEINPUT, 'r') as fileinput:
        lines = fileinput.readlines()
        for line in lines:
            entry = {}
            nodeid = line.split('\t')
            edgeValue = nodeid[4].split('\n')[0]
            if edgeValue == "1":
                conbi = nodeid[0] + "." + nodeid[1]
                entry[conbi] = nodeid[4]
                data.update(entry)
                conbi = nodeid[1] + "." + nodeid[0]
                entry[conbi] = nodeid[4]
                data.update(entry)
    fileinput.close()
    print('\tCreated temporary file \'Omahagraph.json\'')

    with open(FILEOUTPUT, 'w') as fileoutput:
        json.dump(data, fileoutput, indent=4)
    fileoutput.close()

    createNodeFiles(index_data, nucli_data)
    #os.remove(FILEOUTPUT)

if __name__ == '__main__':
    main()