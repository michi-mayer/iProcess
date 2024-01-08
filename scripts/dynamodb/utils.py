"""
Functions that can be used in multiple scripts, as they're not tied to the logic of the other scripts
"""
# modules in STD
from contextlib import contextmanager
from json import JSONEncoder
from decimal import Decimal
from time import time


class Singleton(type):
    """A metaclass for creating singleton classes"""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)

        return cls._instances[cls]


class DecimalEncoder(JSONEncoder):
    """A JSON encoder that also handles Decimal values (known Python issue)"""

    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)  # ? if the passed-in object is of type Decimal, then stringify it
        # 👇️ otherwise use the default behavior
        return JSONEncoder.default(self, obj)


@contextmanager
def record_time(description: str = "unknown method"):
    """Records how long does a function run"""
    start = time()
    yield None
    end = round(time() - start, 2)
    print(f"Time spent in {description}: {end}")
