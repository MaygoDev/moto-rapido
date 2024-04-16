import cache
import player

colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"] # List of colors, size of 8

cache.connect()
cache.setColors(colors)
cache.addPlayer(player.Player("Alice", "red"))
cache.addPlayer(player.Player("Bob", "blue"))
cache.addPlayer(player.Player("Charlie", "green"))
cache.addPlayer(player.Player("David", "yellow"))

print(cache.getPlayers())
