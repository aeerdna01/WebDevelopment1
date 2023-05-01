import gzip
import socket
import json

def update_utilizatori(new_data, filename='continut/resurse/utilizatori.json'):
    with open(filename, 'r+') as file:
        # Load existing data into a list.
        file_data = json.load(file)
        print('########################################## file_data')
        print(file_data)
        # Load new data into a list.
        new_data_list = json.loads(new_data)
        print('########################################## new_data_list')
        print(new_data_list)
        # Append new data to existing data list.
        file_data.append(new_data_list)
        # Sets file's current position at offset.
        file.seek(0)
        # Convert back to JSON and write to file.
        json.dump(file_data, file, indent=4)



# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))

# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

while True:
    print ("#########################################################################")
    print ('Serverul asculta potentiali clienti.')

    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    print ('S-a conectat un client.')
    
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print ('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print ('S-a citit linia de start din cerere: ##### ' + linieDeStart + '# ')
            break
    print ('S-a terminat citirea.')
    
    # Interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
    detResursaCeruta = linieDeStart.split(' ')

    resursa = detResursaCeruta[1]
    http = detResursaCeruta[2]

    print('Resursa: ' + resursa)
    print('Html: ' + http)

    # Calea este relativa la directorul de unde a fost executat scriptul
    fisier = None
    try:
        # Construirea informatiilor din rapsuns
        # Deschide fisierul pentru citire in mod binar
        fisier = open("continut/" + resursa, "rb")
        continut = fisier.read()
        fisier.close()

        # Tip media
        extensie = resursa.split('.')[1]
        type = ""
        match extensie:
            case "html":
                type = "text/html; charset=utf-8"
            case "css":
                type = "text/css; charset=utf-8"
            case "js":
                type = "text/js; charset=utf-8"
            case "png":
                type = "image/png"
            case "jpg":
                type = "image/jpeg"
            case "jpeg":
                type = "image/jpeg"
            case "gif":
                type = "image/gif"
            case "ico":
                type = "image/x-icon"
            case "json":
                type = "application/json; charset=utf-8"
            case "xml":
                type = "application/xml; charset=utf-8"
            case _:
                type = ""

        # trimiterea răspunsului HTTP - secțiuni separate de CRLF (Carriage Return - Line Feed)(\r\n)
        # linia de start = HTTP/1.1 200 OK, dacă resursa cerută reprezintă un fișier valid
        mesaj = http + ' 200 OK \r\n'
        clientsocket.sendall(mesaj.encode('utf-8'))
        #  header-e (perechi cheie-valoare) - liniile header din răspuns ar trebui să conțină cel puțin:
        #  Content-Length: lungimea_corpului_mesajului_de_răspuns
        mesaj = "Content-Length: " + str(len(continut)) + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        # Content-Type: tipul_răspunsului (e.g., text/plain
        mesaj = "Content-Type: " + type + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        # Content-Encoding: gzip compresarea corpului mesajului de răspuns
        mesaj = "Content-Encoding: gzip \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        # Server: numele_serverului_vostru
        mesaj = "Server: Istoria Muzicii Server \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        clientsocket.sendall('\r\n'.encode('utf-8'))
        # Continutul din fisierul sursa
        continut_gzip = gzip.compress(continut)
        clientsocket.sendall(continut_gzip)
    except IOError:
        # Daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
        mesajEroare = "Nu a fost găsită nicio pagină web pentru resursa:" + resursa
        if resursa == '/api/utilizatori':
            if detResursaCeruta[0] == "POST":
                print('############################## CERERE')
                print(cerere)
                print('################################  ARRAY')
                array = cerere.split('{')
                print(array)
                myJson = "{" + array[1]
                print('################################################# MY JSON')
                print(myJson)
                update_utilizatori(myJson)
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Length: " + str(len(mesajEroare.encode('utf-8'))) + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Type: text/plain; charset=utf-8\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Server: Istoria Muzicii Server \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        clientsocket.sendall('\r\n'.encode('utf-8'))
        # Continutul din fisierul sursa
        clientsocket.sendall(mesajEroare.encode('utf-8'))
    finally:
        if fisier is not None:
            fisier.close()
    clientsocket.close()
    print ('S-a terminat comunicarea cu clientul.')