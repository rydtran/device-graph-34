# find intersections in tree structure
# create intersection file and format it
# for d3 force layout 

#NOTE: d3.v3 requires inexplicit indexing for links and nodes 
#rather than attaching an explicit id to a node and referencing it
#in a link. Thus, every node is given an index that is referenced
#by a link. A node's index is inexplicitly declared by the order
#in which it is appended into the json file. (i.e, if a node is
#the second node in the list then its index is 2)

import json
from itertools import combinations
import sys

# files necessary to create intersection file
NUCLPATH = 'graphIndexed.mtx_34_NUCLEI'     # verticies contain in each node
JSONPATH = 'graphIndexed.mtx_34_circle.json'    # tree structure
VERTEXID = 'data/indexRevDict.json'                   # original vertex id

# output files
INTEPATH = 'data/intersections.json'       # intersection file
FORCPATH = 'graph_force.json'         # formatted intersection file

#Change these values if needed
CREATE_INTERFILE = True     #true or false
THRESHOLD = int(sys.argv[1])

#open nucli file and obtain the vertex ids for each node
#open the reverse index file to obtain real vertex ids
def getVertexIds(npath, dpath):
    #ARG: string path
    #RET: dict: key   = node id
    #           value = array of vertex ids

    #open index rev dictionary file
    with open(dpath) as file:
        json_data = json.load(file)
        file.close

    #open the nucli file and obtain the vertex ids
    #and change the ids to the real one
    #return the new ids
    with open(npath) as file:
        verticies = {}
        lines = file.readlines()
        for line in lines:
            line = line.split(' ')
            index = line[0]
            temp = line[7:-1]

            dups = {}
            v = []
            for new_id in temp:
                if new_id not in dups:
                    dups.update({new_id:0})
                    v.append(json_data[new_id])
                    #v.append(new_id)

            verticies[index] = v
        file.close()

        print("\tVerticies loaded")
        return verticies

#open circle json file and obtain the tree structure
def getTreeStruct(path, threshold):
    #ARG: string path, int
    #RET: json object

    #to do
    def filterTree(parent, threshold):
        if 'children' not in parent:
            return
        parent['children'] = filter(lambda x: x['size'] > threshold, parent['children'])
        for child in parent['children']:
            filterTree(child, threshold)

    #open circle json file and return the file
    with open(path) as file:
        json_data = json.load(file)
        filterTree(json_data, threshold)
        print("\tThreshold set at {0}".format(threshold))
        file.close()

        print("\tTree loaded")
        return json_data

#using the nucli, circle, and rev index file, find the intersections
def findIntersections(jpath, npath, dpath, threshold):
    #ARG: string path, string path
    #RET: dict: key   = vertex id,
    #           value = array of node ids

    #get the real vertex ids and tree structure
    verticies = getVertexIds(npath, dpath)
    tree = getTreeStruct(jpath, threshold)
    intersections = {}

    #for every node that references the same vertex
    #create #nodes choose 2 (nCk) pairs
    def createLinks(intersections):
        #ARG: dict: key   = vertex id,
        #           value = array of node ids
        #RET: dict: key   = vertex id,
        #           value = array of size 2 arrays
        for vertex, nodes in intersections.iteritems():
            comb = combinations(list(nodes.keys()),2)
            intersections[vertex] = list(comb)

        return intersections

    #remove the verticies that have less than 2 nodes
    def filterIntersections(intersections):
        #ARG: dict
        #RET: dict
        filtered = {}
        for key,value in intersections.iteritems():
            if len(value) > 1:
                filtered.update({key:value})
        return filtered

    #traverse down the tree and for every vertex, find the 
    #deepest nodes that references it
    #if less than 2 nodes reference a vertex then there is
    #no intersection for that vertex
    def intersectionsHelp(parent):

        # if no children return
        if 'children' not in parent:
            return

        # for every child
        for child in parent['children']:

            # get the verticies contained in child
            child_index = str(child['index'])
            parent_index = str(parent['index'])

            if child_index in verticies:

                v = verticies[child_index]

                # for every vertex id
                for vertex in v:

                    if vertex not in intersections:
                        intersections[vertex] = {}

                    # remove the parent index that contains vertex
                    if parent_index in intersections[vertex]:
                        del intersections[vertex][parent_index]

                    # add child index that ref the vertex id
                    intersections[vertex][child_index] = vertex

                intersectionsHelp(child)

    intersectionsHelp(tree)

    #remove the verticies that have less than 2 nodes referencing it
    filtered = filterIntersections(intersections)

    print('\tIntersections found')
    return createLinks(filtered)

def dumpIntersections(ipath, intersections):
    #ARG: str path, dict
    #RET: nothing

    print('\tCreating intersection file')
    with open(ipath, 'w') as file:
        json.dump(intersections, file, indent=4)
        file.close() 

def forcelayout_format(fpath, intersections):
    #ARG: str path, dict
    #RET: nothing

    print('\tCreating force layout file format')
    graph = {'graph':[],'links':[],'nodes':[],'directed':'false','multigraph':'false'}
    links = {}
    inter_count = {}
    index_to_node = []
    node_to_index = {}

    with open(fpath, 'w') as file:
        index = 0

        #create a link and attach the device that results in that link
        #count the number of time a node participates in a link
        #create indicies for every node
        for vertex, nodes in intersections.iteritems():
            for a,b in nodes:
                source = a if a >= b else b
                target = a if a < b else b
                if (source, target) in links:
                    links[source,target].append(vertex)
                else:
                    links.update({(source,target):[vertex]})
                if a not in inter_count:
                    inter_count[a] = 1
                    index_to_node.append(a)
                    node_to_index[a] = index
                    index += 1
                else:
                    inter_count[a] += 1
                if b not in inter_count:
                    inter_count[b] = 1
                    index_to_node.append(b)
                    node_to_index[b] = index
                    index += 1
                    #print(index_to_node[index-1],b,index-1)
                else:
                    inter_count[b] += 1

        #for every node that participates in a link, append it to the graph
        #for every link, append it to the graph
        for i in range(len(index_to_node)):
            n = index_to_node[i]
            size = inter_count[n]
            graph['nodes'].append({'id':n,'size':size,'type':'circle'})
        for a,b in links:
            ai = node_to_index[a]
            bi = node_to_index[b]
            graph['links'].append({'source':ai,'target':bi,'size':len(links[a,b]),'devices':links[a,b]})

        json.dump(graph,file,indent=4)
        file.close()

def main():
    intersections = findIntersections(JSONPATH, NUCLPATH, VERTEXID, THRESHOLD)
    if CREATE_INTERFILE:
        dumpIntersections(INTEPATH, intersections)
    forcelayout_format(FORCPATH,intersections)

if __name__ == '__main__':
    main()