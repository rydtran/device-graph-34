import json

def main():
    jsonPath = 'graphIndexd.mtx_34_circle.json'
    jsonData = getJsonData(jsonPath)

def trimTop(child, threshold):

def filterSubTree(parent, threshold):
    # ARG: json object, int threshold
    # RET: boolean
    if 'children' not in parent:
        return True if parent['size'] > threshold or parent['size'] == 0 else False
    else:
        return True

def filterTree(parent, threshold):
    # ARG: json object, int threshold
    # RET: json object
    if 'children' not in parent:
        return
    # Filter the children that meet the threshold
    parent['children'] = filter(lambda x: x['size'] > threshold, parent['children'])
    for child in parent['children']:
        return filterTree(child, threshold)

def getJsonData(jsonPath):
    # ARG: string path
    # RET: json object
    with open(jsonPath, 'r') as json_file:
        json_data = json.load(json_file)
        json_file.close()
        return json_data

if __name__ == '__main__':
    main()