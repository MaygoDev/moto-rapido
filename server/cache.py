import redis
from typing import List, Dict

r = None

def connect():
    global r
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    if r.ping():
        print("Connected to Redis.")


def getColors() -> List[str]:
    return r.lrange('colors', 0, -1)

def getPlayerColors() -> Dict[str, str]:
    return r.hgetall('players')

def getPlayerScores() -> Dict[str, int]:
    return r.zrange('players:leaderboard', 0, -1, withscores=True)

def setColors(colors):
    r.delete('colors')
    r.rpush('colors', *colors)

def clearPlayers():
    r.delete('players')
    r.delete('players:leaderboard')
    print("Cleared players")