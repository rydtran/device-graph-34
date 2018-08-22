import os
import sys

GRAPH = sys.argv[1]
THRESHOLD = sys.argv[2]

def main():
    # print('Creating mtx format')
    # os.system('python2.7 scripts/createIndexed.py ' + GRAPH)

    # #Need to run nucleus decomposition to continue
    
    # print('Updating json file')
    # os.system('python2.7 scripts/updateJson.py')

    # print('Creating force layout files')
    # os.system('python2.7 scripts/intersections.py ' + THRESHOLD)

    # print('Creating metadata files for nodes')
    # os.system('python2.7 scripts/node_metadata.py ' + THRESHOLD)

    print('Creating search list for search engine') 
    os.system('python2.7 scripts/tipue_content.py')

if __name__ == '__main__':
    main()