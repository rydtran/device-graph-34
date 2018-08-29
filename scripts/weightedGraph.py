#requires nuclei file, mtx file, reverse index file


import json
from Queue import Queue as queue
import sys

NUCPATH = '../graphIndexed.mtx_34_NUCLEI'
INDPATH = '../data/indexRevDict.json'
MTXPATH = '../graphIndexed.mtx'
OUTPATH = '../graph_weighted.json'
THRESHOLD = int(sys.argv[1])
PRINT_COUNT_V = 100000
PRINT_COUNT_E = 1000000

#read in the original ids
def getOriginalIds(ipath):
    #ARG: string path
    #RET: dict: key   = new id
    #           value = original id

    #open index rev dictionary file
    with open(ipath) as file:
        json_data = json.load(file)
        file.close()

        return json_data

#takes in the nuclei path and rev index file
def getVertexIds(npath, orig_ids, threshold):
    #ARG: string paths
    #RET: dict: key   = node id
    #           value = array of vertex ids
    #     dict: key   = vertex id
    #           value = array of node ids

    count = 0
    #open the nucli file and obtain the vertex ids
    #and change the ids to the real one
    #return the new ids
    with open(npath) as file:
        vertices = {}
        rev_vertices = {}
        lines = file.readlines()
        for line in lines:
            line = line.split(' ')
            index = str(line[0])
            size = int(line[2])
            temp = line[7:-1] #contains the vertices

            if size > threshold:
                dups = {}
                v = []
                for new_id in temp:
                    if new_id not in dups:
                        dups.update({new_id:0})
                        orig_id = str(orig_ids[new_id])
                        v.append(orig_id)
                        #v.append(new_id)

                        #create a rev dictionary as well
                        if orig_id in rev_vertices:
                            rev_vertices[orig_id].append(index)
                        else:
                            rev_vertices[orig_id] = []
                            rev_vertices[orig_id].append(index)

                vertices[index] = v

            #sainity check
            count += 1
            if count%PRINT_COUNT_V is 0:
                print("\t {0}".format(count))

        file.close()

        print('\tVertices loaded')
        return vertices, rev_vertices

# creates an adjacency list using a dictionary
def getEdges(mpath, orig_ids):
    #ARG: string path
    #RET: dict: key   = vertex id
    #           value = array of vertex ids

    edges = {}
    count = 0
    with open(mpath) as file:
        lines = file.readlines()#[1:]
        for line in lines:
            line = line.split('\t')
            index = str(line[0])
            value = line[1].split('\n')[0]

            orig_id = str(orig_ids[index])
            orig_va = str(orig_ids[value])
            if orig_id in edges:
                edges[orig_id].append(orig_va)
            else:
                edges[orig_id] = []
                edges[orig_id].append(orig_va)
            if orig_va in edges:
                edges[orig_va].append(orig_id)
            else:
                edges[orig_va] = []
                edges[orig_va].append(orig_id)

            #sainity check
            count += 1
            if count%PRINT_COUNT_E is 0:
                print("\t {0}".format(count))

        file.close()
        print('\tEdges loaded')
        return edges

def createWeightedGraph(opath, nodes, rev_nodes, edges):
    #ARG: string path, dict1, dict2, dict3
    #dict1: key   = node id
    #       value = array of vertice ids
    #dict2: key   = vertex id
    #       value = array of node ids
    #dict3: key   = vertex id
    #       value = array of vertex ids
    #RET: dict: key   = node id
    #           value = dict: key   = node id
    #                         value = weight

    graph = {}
    visited = {}
    q = queue()

    s = nodes.keys()[0]
    q.put(s)
    visited[s] = True
    graph[s] = {}

    while(not q.empty()):
        node = q.get()

        if node not in visited:
            graph[node] = {}

        #we want to create a new graph where if there exist an
        #edge between vertices in a node then create an edge
        #between the two nodes.
        #the weight of the edge is equal to the number of
        #edges that exist between two nodes
        for aVertex in nodes[node]: #every vertex (a) in a node
            for bVertex in edges[aVertex]: #get the vertex b connected to vertex a
                for onode in rev_nodes[bVertex]: #get every node that contains that vertex (b)
                    if onode not in graph[node]: #increase the weight between node and onode
                        graph[node][onode] = 1
                    else:
                        graph[node][onode] += 1  #add this edge
                    if onode not in visited:     #push to queue if not seen before
                        visited[onode] = True
                        q.put(onode)

    with open(opath, 'w') as file:
        json.dump(graph, file, indent='4')
        file.close()
    return graph

def main():
    orig_ids = getOriginalIds(INDPATH)
    nodes, rev_nodes = getVertexIds(NUCPATH, orig_ids, THRESHOLD)
    edges = getEdges(MTXPATH, orig_ids)
    print(edges)
    graph = createWeightedGraph(OUTPATH, nodes, rev_nodes, edges)
    print(graph)
if __name__ == '__main__':
    main()
