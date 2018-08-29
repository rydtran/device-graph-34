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


def main():
    Json_Path = 'unformat_inter.json'
    TXT_Path = 'IntersectionDistribution.tsv'
    Json = Json_Read_All_Content(Json_Path)

    Size_List = []

    for d in Json:
        b = 0
        print (d)
        #print("---------")
        for items in Json[d]:
            b = b + 1
        print(b)
        Size_List.append(b)  
    TXT_Insert_A_Line(TXT_Path,"Size" + "\t" + "value")
    # print(list(set(Size_List)))
    for i in range(0, 50, 2):
        value = Range_Quantity(Size_List, 0, i)
        print("Size:0-" + str(i), value)
        TXT_Insert_A_Line(TXT_Path,  str(i) + "\t" + str(value))


if __name__ == '__main__':
    main()
