
inputFile=open('graphOmahaIndexed.mtx_34_NUCLEI','r')
outputFile=open('graphOmaha1.txt','w')


for line in inputFile:
    words = line.split()
    wline = words[0]+ '\t' + words[2] +'\t'+words[4]+'\t' + '\n'
    outputFile.write(wline)


inputFile.close()
outputFile.close()