import websocket
import asyncio
import json
import player


colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"] # List of colors, size of 8
players = [] # List of players


def player_join(json_message):
    if len(players) >= len(colors): # If the game is full
        return json.dumps({"type": "full"})

    players.append(player.Player(json_message["name"]))
    playerColor = colors[len(players) - 1]
    print(f"{json_message['name']} joined the game with color {playerColor}")
    return json.dumps({"type": "joined", "color": playerColor, "name": json_message["name"]})


async def message(websocket):
    async for message in websocket:
        json_message = json.loads(message)

        if json_message["type"] == "join":
            await websocket.send(player_join(json_message))
        elif json_message["type"] == "forward":
            await websocket.send(player_join(json_message))



if __name__ == "__main__":
    asyncio.run(websocket.main(message))
