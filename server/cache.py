import redis
from typing import List, Dict

r = None


def connect():
    global r
    r = redis.Redis(host='redis', port=6379)
    if r.ping():
        print("REDIS>> Connected.")


def getColors() -> List[str]:
    return r.lrange('colors', 0, -1)


def getPlayerColors() -> Dict[str, str]:
    return r.hgetall('players')


def getPlayerScores() -> Dict[str, int]:
    return r.zrange('players:leaderboard', 0, -1, withscores=True)

def addPlayerScore(name, score):
    return r.zincrby('players:leaderboard', score, name)


def setColors(colors):
    r.delete('colors')
    r.rpush('colors', *colors)
    print(f"REDIS>> Added {len(colors)} colors. ")


def clearGame():
    r.delete('players')
    r.delete('players:leaderboard')
    r.delete('secrets')
    r.delete('players:ready')
    print("REDIS>> Cleared game.")


def hasSecret(name):
    return r.hexists('secrets', name)


def getSecret(name):
    return r.hget('secrets', name)


def setSecret(name, secret):
    r.hset('secrets', name, secret)


def getNameBySecret(secret):
    for name, playerSecret in r.hgetall('secrets').items():
        if playerSecret.decode('utf-8') == secret:
            return name.decode('utf-8')
    return None


def addReady(name):
    r.lpush('players:ready', name)

def getReady():
    return r.llen('players:ready')

def clearReady():
    r.delete('players:ready')
    print("REDIS>> Cleared ready players.")