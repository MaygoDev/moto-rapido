from typing import List

import redis
import player

r = None

def connect():
    global r
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    if r.ping():
        print("Connected to Redis.")


def getColors() -> List[str]:
    return r.lrange('colors', 0, -1)

def getPlayers() -> List[str]:
    return r.hgetall('players')


def setColors(colors):
    r.delete('colors')
    for color in colors:
        r.rpush('colors', color)


def addPlayer(player: player.Player):
    r.hset('players', player.name, player.color)
    r.zadd('players:leaderboard', {player.name: player.meters})
    print(f"Added {player.name} to the game")
