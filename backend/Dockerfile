FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fix SSL handshake errors with MongoDB Atlas on newer OpenSSL versions
ENV OPENSSL_CONF=/app/openssl.cnf

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
