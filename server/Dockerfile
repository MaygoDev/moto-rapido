FROM python:3.12

WORKDIR /app
COPY . .

RUN pip install websockets redis

CMD [ "python", "-u", "main.py" ]