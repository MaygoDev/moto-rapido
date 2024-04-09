class Player:

    def __init__(self, name):
        self.name = name
        self.meters = 0

    def move(self, meters):
        self.meters += meters
        print(f"{self.name} moved {meters} meters")

    def __str__(self):
        return f"{self.name} is at {self.meters} meters"
