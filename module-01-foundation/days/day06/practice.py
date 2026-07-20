from abc import ABC, abstractmethod
import math



class Report:
    def build(self):
        return "Report has been built."


class ReportSaver:
    def save(self, report):
        print(f"Saving report: {report}")


class ReportEmailer:
    def email(self, report):
        print(f"Emailing report: {report}")




class Shape(ABC):

    @abstractmethod
    def area(self):
        pass


class Circle(Shape):

    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Square(Shape):

    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


class Triangle(Shape):

    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height




class AppSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance




class ShapeFactory:

    @staticmethod
    def create(kind, *args):

        kind = kind.lower()

        if kind == "circle":
            return Circle(*args)

        elif kind == "square":
            return Square(*args)

        elif kind == "triangle":
            return Triangle(*args)

        else:
            raise ValueError("Unknown shape type.")



class NewsAgency:

    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def notify(self, news):
        for subscriber in self.subscribers:
            subscriber.update(news)


class EmailSubscriber:

    def update(self, news):
        print(f"Email Subscriber received: {news}")


class MobileSubscriber:

    def update(self, news):
        print(f"Mobile Subscriber received: {news}")




print("----- SRP -----")

report = Report()
content = report.build()

saver = ReportSaver()
emailer = ReportEmailer()

saver.save(content)
emailer.email(content)



print("\n----- OCP -----")

shapes = [
    Circle(5),
    Square(4),
    Triangle(6, 3)
]

for shape in shapes:
    print(f"{shape.__class__.__name__} Area = {shape.area():.2f}")



print("\n----- Singleton -----")

setting1 = AppSettings()
setting2 = AppSettings()

print("Currency:", setting1.currency)
print("Same object?", setting1 is setting2)



print("\n----- Factory -----")

shape1 = ShapeFactory.create("circle", 7)
shape2 = ShapeFactory.create("square", 5)
shape3 = ShapeFactory.create("triangle", 8, 4)

print(f"Circle Area = {shape1.area():.2f}")
print(f"Square Area = {shape2.area():.2f}")
print(f"Triangle Area = {shape3.area():.2f}")



print("\n----- Observer -----")

agency = NewsAgency()

email_subscriber = EmailSubscriber()
mobile_subscriber = MobileSubscriber()

agency.subscribe(email_subscriber)
agency.subscribe(mobile_subscriber)

agency.notify("Python 3.15 has been released!")