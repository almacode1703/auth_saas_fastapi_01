FROM python:3.11-slim        
# Step 1 - Buy a new computer with Python 3.11 already installed

WORKDIR /app                 
# Step 2 - Create a folder called /app and work inside it

COPY requirements.txt .      
# Step 3 - Copy your requirements.txt into that computer

RUN pip install -r requirements.txt  
# Step 4 - Install all packages on that computer

COPY . .                     
# Step 5 - Copy all your backend code into that computer

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
