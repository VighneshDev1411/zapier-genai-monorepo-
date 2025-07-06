FROM python:3.11-slim
WORKDIR /app

# Install requirements (no system dependencies needed for email-validator)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt "pydantic[email]"

COPY ./app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]