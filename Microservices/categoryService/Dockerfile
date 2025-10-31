# Use official Python image
FROM python:3.11

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the service code
COPY . .

# Expose the port the service will run on
EXPOSE 8000

# Run FastAPI with uvicorn
CMD ["fastapi", "run", "category.py", "--host", "0.0.0.0", "--port", "8000"]
