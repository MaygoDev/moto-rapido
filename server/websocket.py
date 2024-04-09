#!/usr/bin/env python

import asyncio
from websockets.server import serve

async def main(message):
    async with serve(message, "localhost", 8765):
        await asyncio.get_running_loop().create_future()  # run forever
