#!/usr/bin/env python

import asyncio
import json

from websockets.server import serve

import player
import cache as cache


def player_join(json_message):
    players = cache.getPlayers()
    colors = cache.getColors()
    if len(players) >= len(colors):  # If the game is full
        return json.dumps({"type": "full"})

    playerColor = colors[len(players) - 1]
    cache.addPlayer(player.Player(json_message["name"], playerColor))

    print(f"{json_message['name']} joined the game with color {playerColor}")

    return json.dumps({"type": "joined", "color": playerColor, "name": json_message["name"]})


async def message(websocket):
    async for message in websocket:
        json_message = json.loads(message)

        if json_message["type"] == "join":
            await websocket.send(player_join(json_message))
        elif json_message["type"] == "forward":
            await websocket.send(player_join(json_message))


async def main(message):
    async with serve(message, "localhost", 8765):
        await asyncio.get_running_loop().create_future()  # run forever


if __name__ == "__main__":
    cache.connect()
    asyncio.run(main(message))
