import os
import sys

GRAPH = sys.argv[1]
ALGORITHM = sys.argv[2]
THRESHOLD = sys.argv[3]

def main():
    # print('Creating mtx format')
    # os.system('python2.7 scripts/createIndexed.py ' + GRAPH)

    # #Need to run nucleus decomposition to continue
    # print('Running nucleus decomposition')
    # os.chdir('nd')
    # os.system('make')
    # os.system('./nucleus ' + 'graphIndexed.mtx' + ALGORITHM + ' YES')
    
    # print('Updating json file')
    # os.system('python2.7 scripts/updateJson.py ' + ALGORITHM)

    # print('Creating force layout files')
    # os.system('python2.7 scripts/intersections.py ' +ALGORITHM+ ' ' + THRESHOLD)

    print('Creating metadata files for nodes')
    os.system('python2.7 scripts/metadata.py ' +ALGORITHM+ ' ' + THRESHOLD)

    # print('Creating search list for search engine') 
    # os.system('python2.7 scripts/tipue_content.py')

if __name__ == '__main__':
    main()