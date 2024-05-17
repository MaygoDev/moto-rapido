import cache
import websocket
import asyncio

colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"] # List of colors, size of 8

cache.connect()
cache.setColors(colors)
cache.clearPlayers()

asyncio.run(websocket.main(websocket.message))
