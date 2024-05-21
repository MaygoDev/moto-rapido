#!/usr/bin/env python

import asyncio
import json
import os

from websockets.server import serve

import cache as cache

playerSockets = set()

def player_join(json_message):
    # Generate secret
    name = json_message["name"]
    secret = generateSecret()

    if cache.hasSecret(name):
        secret = None
    else:
        cache.setSecret(name, secret)
        print(f"WEBSOCKET >> Player {name} claimed secret {secret}")


    return secret

def generateSecret():
    """
    Generate a random secret
    From https://stackoverflow.com/a/2782293

    :return: A random hex secret with 15 bytes and 30 characters
    """
    return os.urandom(15).hex()


def ready(json_message):
    secret = json_message["secret"]

    name = cache.getNameBySecret(secret)
    if name is not None:
        cache.addReady(name)
        print(f"WEBSOCKET >> Player {name} is ready.")
        return json.dumps({"type": "ready", "name": name})

    return None

def forward(json_message):
    secret = json_message["secret"]

    name = cache.getNameBySecret(secret)
    if name is not None:
        newScore = cache.addPlayerScore(name, 10) # Add 10 pixels to the player
        print(f"WEBSOCKET >> Player {name} scored {newScore}")
        return json.dumps({"type": "forwarded", "name": name, "score": newScore})

    return None


def checkStart():
    readyPlayers = cache.getReady()
    players = len(cache.getPlayerColors())
    if readyPlayers == players and players > 1:
        print("WEBSOCKET >> All players are ready. Starting game.")
        cache.clearReady()
        return json.dumps({"type": "start"})


async def message(websocket):
    playerSockets.add(websocket)
    print(f"WEBSOCKET >> Player {websocket.remote_address} connected.")
    async for message in websocket:
        json_message = json.loads(message)
        print(f"WEBSOCKET >> Recieved message: {json_message} from {websocket.remote_address}")

        if json_message["type"] == "join":
            joined = player_join(json_message)
            await websocket.send(json.dumps({"type": "joined", "secret": joined}))
            if joined is not None:
                await broadcast(json.dumps({"type": "playerJoined",
                                            "name": json_message["name"],
                                            "color": json_message["color"]}))

        elif json_message["type"] == "ready":
            readyState = ready(json_message)
            if readyState is not None:
                await broadcast(readyState)
            start = checkStart()
            if start is not None:
                await broadcast(start)

        elif json_message["type"] == "forward":
            forwardMessage = forward(json_message)
            if forwardMessage is not None:
                await broadcast(forwardMessage)
    playerSockets.remove(websocket)
    print(f"WEBSOCKET >> Player {websocket.remote_address} disconnected.")

async def broadcast(message):
    for playerSocket in playerSockets:
        await playerSocket.send(message)

async def main(message):
    async with serve(message, "0.0.0.0", 8765):
        await asyncio.get_running_loop().create_future()  # run forever