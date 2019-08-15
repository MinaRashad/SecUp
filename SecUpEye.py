import cv2
import threading
import face_recognition
import pickle
import socket
import time
import os
import sys
import requests


class SecUpEye:

    def __init__(self):
        try:
            self.__continue = True
            self.__isConnectingLocally = True
            self.__isConnectedLocally = False
            self.__isConnectedGlobally = False
            self.__isConnectedGlobally = False
            self.__haveIps = False
            self.__id = None
            self.__mode = 'local'
            # config_file = open('sec_up_eye.config', 'r')
            # configs = config_file.readlines()
            # for line in configs:
            #     name = line.split('=')[0]
            #     value = line.split('=')[1]
            #     if name == 'id':
            #         self.__id = value

            self.__SecUpMonitorIp = ['127.0.0.1', 1200]
            self.__SecUpKnowledgeIp = ['127.0.0.1', 2300]
            self.__cameraStream = cv2.VideoCapture(0)
            if os.path.isfile('encodes.pickle'):
                self.__data = pickle.load(open('encodes.pickle', 'rb'))
            else:
                self.__data = None
            self.__detectedNames = []
            self.__detectionTimes = []
            self.__log = {'name': [], 'time': []}
            time_info = time.ctime(time.time()).split(' ')
            log_file_name = time_info[1] + ' ' + time_info[2] + ' ' + time_info[4] + '.txt'
            self.__logFile = open(log_file_name, 'a')
            self.__logIndex = 0
            self.__names = []
            self.__SecUpMonitorSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.__SecUpMonitorSocket.settimeout(12)
            self.__SecUpMonitor = None
            self.__SecUpKnowledgeSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.__SecUpKnowledgeSocket.settimeout(12)
            self.__SecUpKnowledge = None
            self.__broadcastSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.__broadcastSocket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            self.__broadcastSocket.bind(('', 10100))
            self.__connectionThread = threading.Thread()
            self.__recognitionThread = threading.Thread()
            self.__sendingThread = threading.Thread()
            self.__respondingThread = threading.Thread()
            self.__dataThread = threading.Thread()
            self.__serverThread = threading.Thread()
            self.__serverThread.run = self.__request_data_from_SecUpServer
            self.__connectionThread.run = self.__connect
            self.__recognitionThread.run = self.__recognition
            self.__sendingThread.run = self.__send_data_to_SecUpMonitor
            self.__respondingThread.run = self.__respond_to_SecUpMoniter
            self.__dataThread.run = self.__receive_data_from_SecUpKnowledge

        except FileNotFoundError as e:
            print('cannot find the encodes.pickle file')
            # messagebox.showerror('SecUpEye - Error', 'the encodings file is not found')

    def __connect(self):
        print('starting connection thread')
        try:
            count = 0
            if not self.__haveIps:
                msg = 'SecUpEye~'
                self.__broadcastSocket.sendto(msg.encode(), ('<broadcast>', 10101))
                self.__broadcastSocket.sendto(msg.encode(), ('<broadcast>', 10102))
                print('Sent broadcast messages')
            while not self.__haveIps:
                received = ''.encode()
                address = None
                print('Receiving')
                while not received.endswith('~'.encode()):
                    msg, address = self.__broadcastSocket.recvfrom(128)
                    received += msg
                received_string = received.decode().strip('~')
                if received_string == 'SecUpMonitor':
                    self.__SecUpMonitorIp[0] = address[0]
                    count += 1

                elif received_string == 'SecUpKnowledge':
                    self.__SecUpKnowledgeIp[0] = address[0]
                    self.__dataThread.start()
                    count += 1

                self.__haveIps = count == 2
                print(received_string)

            if self.__continue:
                while self.__isConnectingLocally:
                    self.__SecUpMonitorSocket.bind(tuple(self.__SecUpMonitorIp))
                    self.__SecUpMonitorSocket.listen(12)
                    print('Accepting')
                    self.__SecUpMonitor, address = self.__SecUpMonitorSocket.accept()
                    print(self.__SecUpMonitor)
                    print('accepted, connected to ' + str(address))
                    self.__isConnectingLocally = False
                    self.__isConnectedLocally = True
                    self.__sendingThread.start()
                    self.__respondingThread.start()
        except socket.timeout as e:
            print('failure at connection thread :-\n    ' + str(e))
            del self.__connectionThread
            self.__connectionThread = threading.Thread()
            self.__connectionThread.run = self.__connect
            self.__connectionThread.start()
        print('ending connection thread')

    def __request_data_from_SecUpServer(self):

            res = requests.post('http://127.0.0.1:2999',{'user','pass'})
            print(res)

    def __send_data_to_SecUpMonitor(self):
        print('starting sending thread')
        try:
            while self.__recognitionThread.isAlive():
                if not self.__continue:
                    print('ending sending thread')
                    sys.exit(0)

                if not self.__isConnectedLocally:
                    print('ending sending thread because connection is terminating')
                    sys.exit(0)

                for (name, detection_tine) in zip(self.__detectedNames, self.__detectionTimes):
                    message = 'detection:' + name + ' ' + detection_tine[-1] + '~'
                    self.__SecUpMonitor.send(message.encode())
                self.__detectedNames.clear()
                self.__SecUpMonitor.send('null~'.encode())
        except ConnectionResetError as e:
            print('connection reset, terminating sending thread')
            if not self.__isConnectingLocally:
                self.__isConnectingLocally = True
                self.connect_to_SecUpMonitor()
        except socket.timeout as e:
            print('sending timed out')

    def __respond_to_SecUpMoniter(self):
        print('starting responding thread')
        try:
            while self.__recognitionThread.isAlive():
                if not self.__continue:
                    sys.exit(0)

                cmd = ''.encode()
                while not cmd.endswith('~'.encode()):
                    # print('received till now: ' + cmd.decode())
                    cmd += self.__SecUpMonitor.recv(4096)
                cmd = cmd.decode().lower().strip('~')
                print('cmd: ' + cmd)
                if cmd == 'showrecord':
                    i = 0
                    while i < len(self.__log['name']):
                        log_line = 'cmdRespond$showrecord:' + self.__log['name'][i] + ' detected at ' + self.__log['time'][i] + '~'
                        self.__SecUpMonitor.send(log_line.encode())
                        i += 1

                elif cmd == 'info':
                    print('SecUpEye v1.0 beta')

                elif cmd == 'globalize':
                    self.__isConnectingLocally = False
                    # self.__isConnect

                elif cmd == 'close':
                    self.__isConnectedLocally = False
                    self.__isConnectingLocally = True
                    msg = 'cmdRespond$close:close~'
                    self.__SecUpMonitor.send(msg.encode())
                    print('ending responding thread')
                    self.connect_to_SecUpMonitor()
                    sys.exit(0)

                elif cmd == 'shutdown':
                    print('shutdown')
                    log_line = 'cmdRespond$shutdown:shutdown~'
                    self.__SecUpMonitor.send(log_line.encode())
                    self.__continue = False
                    sys.exit(0)
        except ConnectionResetError as e:
            print('connection reset, terminating responding thread')
            if not self.__isConnectingLocally:
                self.__isConnectingLocally = True
                self.connect_to_SecUpMonitor()
        except socket.timeout as e:
            print('responding timed out')

    def __receive_data_from_SecUpKnowledge(self):
        try:
            if not self.__continue:
                print('ending data thread')
                sys.exit(0)

            self.__SecUpKnowledgeSocket.bind(tuple(self.__SecUpKnowledgeIp))
            self.__SecUpKnowledgeSocket.listen(12)
            self.__SecUpKnowledge, _ = self.__SecUpKnowledgeSocket.accept()
            data = ''.encode()
            while not data.endswith('~'.encode()):
                data += self.__SecUpKnowledge.recv(4096)

            data = pickle.loads(data)
            self.__data['names'] = data['names']
            self.__data['encodings'] = data['encodings']
            picklefile = open('encodes.pickle', 'wb')
            picklefile.write(pickle.dumps(self.__data))
            picklefile.flush()
            picklefile.close()

            # end of func
            self.__SecUpKnowledge.shutdown(socket.SHUT_RDWR)
            self.__SecUpKnowledge.close()
            del self.__dataThread
            del self.__SecUpKnowledgeSocket
            self.__SecUpKnowledge = None
            self.__SecUpKnowledgeSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.__SecUpKnowledgeSocket.settimeout(12)
            self.__SecUpKnowledgeSocket.bind(tuple(self.__SecUpKnowledgeIp))
            self.__dataThread = threading.Thread()
            self.__dataThread.run = self.__receive_data_from_SecUpKnowledge
            self.__dataThread.start()
        except socket.timeout as e:
            # print('failure at data thread :-\n  ' + str(e))
            del self.__dataThread
            self.__dataThread = threading.Thread()
            self.__dataThread.run = self.__receive_data_from_SecUpKnowledge
            self.__dataThread.start()

    def __recognition(self):
        print('starting recognition thread')
        success, frame = self.__cameraStream.read()
        while success:
            if not self.__continue:
                self.end()
                print('ending recognition thread')
                sys.exit(0)
            image = frame
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            boxes = face_recognition.face_locations(rgb, 1)
            encodings = face_recognition.face_encodings(rgb, boxes)
            self.__names = []

            for encoding in encodings:
                matches = face_recognition.compare_faces(self.__data['encodings'], encoding)
                name = 'unknown'
                if True in matches:
                    matchedIndexes = [i for (i, b) in enumerate(matches) if b]
                    counts = {}

                    for i in matchedIndexes:
                        name = self.__data['names'][i]
                        counts[name] = counts.get(name, 0) + 1
                        name = max(counts, key=counts.get)

                self.__names.append(name)
                self.__log['time'].append(time.ctime(time.time()))
                self.__log['name'].append(name)
            for name in self.__names:
                if name not in self.__detectedNames:
                    self.__detectedNames.append(name)
                    self.__detectionTimes.append([time.ctime(time.time())])
                else:
                    i = self.__detectedNames.index(name)
                    self.__detectionTimes[i].append(time.ctime(time.time()))
                # print('seeing ' + name)
            success, frame = self.__cameraStream.read()

    def start(self):
        self.__recognitionThread.start()
        #self.__connectionThread.start()
        self.__serverThread.start()
        # self.__dataThread.start()

    def connect_to_SecUpMonitor(self):
        print('reconnecting to SecUpMonitor')
        self.__SecUpMonitorSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.__SecUpMonitorSocket.bind(tuple(self.__SecUpMonitorIp))
        self.__SecUpMonitor = None
        self.__connectionThread = threading.Thread()
        self.__sendingThread = threading.Thread()
        self.__respondingThread = threading.Thread()
        self.__connectionThread.run = self.__connect
        self.__sendingThread.run = self.__send_data_to_SecUpMonitor
        self.__respondingThread.run = self.__respond_to_SecUpMoniter
        self.__connectionThread.start()

    def end(self):
        i = 0
        print('writing log')
        while i < len(self.__log['time']):
            line = self.__log['name'][i] + ' was detected at ' + str(self.__log['time'][i])
            self.__logFile.write(line + '\n')
            i += 1
        print(' ... done')
        self.__logFile.flush()
        self.__logFile.close()
        self.__cameraStream.release()

