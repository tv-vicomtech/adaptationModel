from flask import Flask, request #import main Flask class and request object
import itertools
from flask import jsonify
from flask_cors import CORS


app = Flask(__name__) 
CORS(app)

@app.route('/combinations',methods = ['POST', 'GET'])
def make_sets():
	data=request.get_json()
	items=data["items"]	
	num_of_boxes=data["boxes"]
	
	allpossible = []

	for tup in itertools.product(range(num_of_boxes), repeat=len(items)):
		boxes = [list() for _ in range(num_of_boxes)]
		for item, box in zip(items, tup):
		    boxes[box].append(item)

		allpossible.append(boxes)
			
	return jsonify(allpossible)

if __name__ == '__main__':
     app.run(host='0.0.0.0',port='5002')
