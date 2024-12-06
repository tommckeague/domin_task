FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY ./app /app
COPY ./requirements.txt /app/requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
