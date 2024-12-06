import os
import json
import requests
import asyncio
from queue import Queue
from collections.abc import Callable
from typing import Optional
from fastapi import FastAPI, Request
from api import endpoints

# setup app and mongodb handler
app = FastAPI()

app.include_router(endpoints.router)
