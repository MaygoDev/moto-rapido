import cache
import websocket
import asyncio

colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"] # List of colors, size of 8

cache.connect()
cache.setColors(colors)
cache.clearGame()

asyncio.run(websocket.main(websocket.message))
