#coding:utf-8
#ignore when their parents are size of 0, 10 and up
import json

#Size, Density, and 2D distributions
# from tqdm import tqdm


def Json_Read_All_Content(Path):
    """Json read everything"""
    with open(Path, 'r') as json_file:
        return json.load(json_file)


# TXT_insertaline
def TXT_Insert_A_Line(Path, Text):
    with open(Path, "a+") as f:
        f.write(Text + "\n")
        f.close()


def Range_Quantity(Size_List, Min, Max):
    """
    :param Size_List: num of lists
    :param Min: min
    :param Max: max
    :return: num
    """
    Number = 0
    for Size in Size_List:
        if Min <= Size <= Max:
            Number = Number + 1
    return Number

def Range_Quantity2D(Size_List, Min, Max1, Max2):
    """
    :param Size_List: num of lists
    :param Min: min
    :param Max: max
    :return: num
    """
    Number = 0
    for Size in Size_List[0]:
        if Min <= Size <= Max1:
            if Min <= Size_List[1][Size] <= Max2:
                Number = Number + 1
    return Number



def main():
    #cleanupNUCLEI
    inputFile=open('graphOmahaIndexed.mtx_34_NUCLEI','r')
    outputFile=open('graphOmaha1.txt','w')

    for line in inputFile:
        words = line.split()
        wline = words[0]+ '\t' + words[2] +'\t'+words[4]+'\t' + '\n'
        outputFile.write(wline)

    inputFile.close()
    outputFile.close()


    #createjson
    FILEINPUT   = 'graphOmaha1.txt'
    FILEOUTPUT  = 'distributioninput.json'

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

    #Distributions
    Json_Path = 'distributioninput.json'
    Size_Path = 'SizeDistribution.tsv'
    Density_Path = 'DensityDistribution.tsv'
    TXT_Path = 'Distribution2D.tsv'
    
    Json = Json_Read_All_Content(Json_Path)

    #Size distribution
    Size_List = []
    for d in Json:
        a=int(Json[d][0])
        Size_List.append(a)
    TXT_Insert_A_Line(Size_Path,"Size" + "\t" + "value")
    # print(list(set(Size_List)))
    for i in range(0, 140, 5):
        value = Range_Quantity(Size_List, 0, i)
        print("Size:0-" + str(i), value)
        TXT_Insert_A_Line(Size_Path,  str(i) + "\t" + str(value))

    #Density distribution
    Density_List = []
    for d in Json:
            # print("[children_1] size", children_1['size'])
        b=float(Json[d][1])*100
        Density_List.append(b)
            #print(b)
    TXT_Insert_A_Line(Density_Path,"density" + "\t" + "value")
    # print(list(set(Size_List)))
    for i in range(0, 101, 5):
        value = Range_Quantity(Density_List, 0, i)
        b=float(i)/100
        print("Density:0-" + str(b), value)
        TXT_Insert_A_Line(Density_Path,  str(b) + "\t" + str(value))

    #2D distribution
    List = []
    List.append([])
    List.append([])
    for d in Json:
        a=int(Json[d][0])
        List[0].append(a)
        b=float(Json[d][1])*100
        List[1].append(b)
    TXT_Insert_A_Line(TXT_Path,"Size" + "\t" + "Density" + "\t" + "Value")
    for i in range(0, 150, 10):
        for j in range(0, 101, 10):
            value = Range_Quantity2D(List, 0, i, j)
    #    print("Size:0-" + str(i), value)   
            a = float(j)/100
            TXT_Insert_A_Line(TXT_Path,  str(i) + "\t" + str(a) + "\t" + str(value))



if __name__ == '__main__':
    main()