import json
import sys

inputFile=open(sys.argv[1],'r')
outputFile=open('graphIndexed.mtx','w')
outputFileDict = open('data/indexDict.json','w')

d={}
r={}
index = 1

for line in inputFile:
	words = line.split()
	if words[0] in d:
		if words[1] in d:
			wline = str(d[words[0]])+'\t'+str(d[words[1]])+'\n'
			outputFile.write(wline)
		else:
			d[words[1]] = index
			r[index] = words[1]
			index = index + 1
			wline = str(d[words[0]])+'\t'+str(d[words[1]])+'\n'
			outputFile.write(wline)
	else:
		if words[1] in d:
			d[words[0]] = index
			r[index] = words[0]
			index = index + 1
			wline = str(d[words[0]])+'\t'+str(d[words[1]])+'\n'
			outputFile.write(wline)
		else:
			d[words[0]] = index
			r[index] = words[0]
			index = index + 1
			d[words[1]] = index
			r[index] = words[1]
			index = index + 1
			wline = str(d[words[0]])+'\t'+str(d[words[1]])+'\n'
			outputFile.write(wline)

jsond = json.dumps(r)
outputFileDict.write(jsond)

inputFile.close()
outputFile.close()
outputFileDict.close()
