class Player:

    def __init__(self, name, color):
        self.name = name
        self.color = color
        self.meters = 0

    def move(self, meters):
        self.meters += meters
        print(f"{self.name} moved {meters} meters")

    def __str__(self):
        return f"{self.name} is at {self.meters} meters with color {self.color}"

    def serialize(self) -> dict:
        return {"name": self.name, "color": self.color, "meters": self.meters}
