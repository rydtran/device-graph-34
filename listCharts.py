from os import listdir
from os.path import isfile, join
from flask import Flask

app = Flask(__name__)

@app.route('/charts')
def listCharts():
	mypath = '../data/chart_data'
	files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
	return 'hi'

if __name__ == '__main__':
	app.run(debug = True)