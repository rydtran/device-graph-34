import json

FILEINPUT   = 'graphOmaha1.txt'
FILEOUTPUT  = 'density.json'

data = {}

with open(FILEINPUT, 'r') as fileinput:

    lines = fileinput.readlines()

    for line in lines:

        entry = {}
        infoarray = line.split('\t')
        entry[infoarray[0]] = infoarray[1],infoarray[2]

        data.update(entry)

fileinput.close()

with open(FILEOUTPUT, 'w') as fileoutput:

    json.dump(data, fileoutput, indent=4)

fileoutput.close()