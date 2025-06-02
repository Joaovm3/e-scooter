def DEBUG_log(prefix, msg):
    with open('log.txt', 'a') as f: 
        f.write(f'{prefix}: {msg}\n')

