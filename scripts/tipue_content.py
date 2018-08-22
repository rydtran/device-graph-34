#produces the tipue_content.js file
#will delete original tipue_contet.js when run

import json
import os

NODEFILES = 'data/nodes/'
TIPUEOUT  = 'tipuesearch/tipuesearch_content.js'

def formatEntry(filename):

    file = NODEFILES + filename

    with open(file, 'r') as inputfile:
        data = json.load(inputfile)

        entry = {}
        entry['title'] = data.keys()[0]
        entry['text'] = ''
        for item in data[entry['title']]:
            entry['text'] = ' '.join([entry['text'], item])
        entry['url'] = ''

        json_str = '\t' + json.dumps(entry)
        return  json_str

def main():

    try:
        os.remove(TIPUEOUT)
    except OSError:
        pass

    with open(TIPUEOUT, 'a+') as outfile:
        outfile.write('var tipuesearch = {"pages": [\n')

        count = 0
        entry_str = ''
        for filename in os.listdir(NODEFILES):
            count+=1
            json_str = ''.join([formatEntry(filename),'\n' if count == len(os.listdir(NODEFILES)) else ',\n'])
            entry_str = ''.join([entry_str, json_str])
            if count%1000 == 0:
                print("\t {0}".format(count))
        outfile.write(entry_str)
        outfile.write(']};')

if __name__ == '__main__':
    main()