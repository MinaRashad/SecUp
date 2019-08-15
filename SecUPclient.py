import requests
hostIP = 'http://127.0.0.1'
port = 2999

# sending names , R will be the new data aka Mina,Kareem 
R = requests.post(f'{hostIP}:{port}/00001',data={'peopleOnCamNow':['Mina', 'Kareem','someone']})
#recieving names Just write a post request or a get request, no data needed
r = requests.post(f'{hostIP}:{port}/test') #00001 is the cam ID

print(R.text) 
print(r.text)