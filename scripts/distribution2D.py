#coding:utf-8
#ignore when their parents are size of 0, 10 and up
import json


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


def Range_Quantity(Size_List, Min, Max1, Max2):
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
    Jsonsize_Path = 'size.json'
    Jsondensity_Path = 'density.json'
    TXT_Path = 'Distribution.tsv'
    Size = Json_Read_All_Content(Jsonsize_Path)
    Density = Json_Read_All_Content(Jsondensity_Path)


    List = []
    List.append([])
    List.append([])
    Size_List = []
    Size_List.append([])
    Size_List.append([])



    for d in Size:
        a=int(Size[d])
        Size_List[0].append(a)
    for d in Density:
        b=float(Density[d])*100
        Size_List[1].append(b)
    #print(Size_List[0][0])
    #print(Size_List[1][0])
    TXT_Insert_A_Line(TXT_Path,"Size" + "\t" + "Density" + "\t" + "Value")
    # print(list(set(Size_List)))
    for i in range(5, 140, 5):
        for j in range(0, 101, 5):
            value = Range_Quantity(Size_List, 0, i, j)
    #    print("Size:0-" + str(i), value)   
            a = float(j)/100
            TXT_Insert_A_Line(TXT_Path,  str(i) + "\t" + str(a) + "\t" + str(value))


if __name__ == '__main__':
    main()
